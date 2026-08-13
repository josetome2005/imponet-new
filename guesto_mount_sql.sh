#!/bin/bash
#
# setup-mysql.sh
#
# Instala y levanta un servidor MySQL 8.0 SIN permisos de administrador,
# usando /tmp (que tiene espacio real en disco, a diferencia de $HOME
# que en este lab es un tmpfs limitado a 2GB).
#
# Pensado para reutilizarse: si ya existe la instalación, salta la
# descarga/extracción y va directo a inicializar (si hace falta) y arrancar.
#
# Uso:
#   chmod +x setup-mysql.sh
#   ./setup-mysql.sh
#
# Para PARAR el servidor más tarde:
#   ./setup-mysql.sh stop
#
# Para CONECTARTE una vez que está corriendo (en otra terminal, o después):
#   export LD_LIBRARY_PATH=/tmp/libfix:$LD_LIBRARY_PATH
#   /tmp/mysql/bin/mysql --socket=/tmp/mysql-data/mysql.sock -u root

set -e

MYSQL_VERSION="8.0.46"
MYSQL_TARBALL="mysql-${MYSQL_VERSION}-linux-glibc2.28-x86_64.tar.xz"
MYSQL_URL="https://dev.mysql.com/get/Downloads/MySQL-8.0/${MYSQL_TARBALL}"

BASE_DIR="/tmp/mysql"
DATA_DIR="/tmp/mysql-data"
LIBFIX_DIR="/tmp/libfix"
SOCKET="/tmp/mysql-data/mysql.sock"
PIDFILE="/tmp/mysql-data/mysql.pid"
PORT="3307"

# --- Modo "stop": para el servidor si está corriendo y sale ---
if [ "$1" == "stop" ]; then
  if [ -f "$PIDFILE" ]; then
    PID=$(cat "$PIDFILE")
    echo "Deteniendo MySQL (PID $PID)..."
    kill "$PID" 2>/dev/null || echo "El proceso ya no estaba corriendo."
    rm -f "$PIDFILE"
  else
    echo "No encontré $PIDFILE, MySQL no parece estar corriendo."
  fi
  exit 0
fi

echo "== 1) Verificando espacio disponible en /tmp =="
df -h /tmp

echo ""
echo "== 2) Arreglando la librería libaio (fix Ubuntu 24.04 'time64') =="
mkdir -p "$LIBFIX_DIR"
if [ ! -e "$LIBFIX_DIR/libaio.so.1" ]; then
  REAL_LIBAIO=$(find /usr/lib -name "libaio.so.1t64*" 2>/dev/null | head -1)
  if [ -n "$REAL_LIBAIO" ]; then
    ln -sf "$REAL_LIBAIO" "$LIBFIX_DIR/libaio.so.1"
    echo "Symlink creado: $LIBFIX_DIR/libaio.so.1 -> $REAL_LIBAIO"
  else
    echo "ADVERTENCIA: no encontré libaio.so.1t64* en el sistema."
    echo "Si mysqld falla más abajo con 'libaio.so.1: cannot open shared object file',"
    echo "buscá manualmente con: find / -name 'libaio.so*' 2>/dev/null"
  fi
else
  echo "Ya existe el symlink, sigo."
fi
export LD_LIBRARY_PATH="$LIBFIX_DIR:$LD_LIBRARY_PATH"

echo ""
echo "== 3) Descarga y extracción de MySQL (si no está ya) =="
if [ ! -x "$BASE_DIR/bin/mysqld" ]; then
  cd /tmp
  if [ ! -f "$MYSQL_TARBALL" ]; then
    echo "Descargando $MYSQL_TARBALL ..."
    wget -q --show-progress "$MYSQL_URL"
  else
    echo "El tarball ya estaba descargado, lo reutilizo."
  fi

  echo "Extrayendo..."
  tar xf "$MYSQL_TARBALL"
  rm -rf "$BASE_DIR"
  mv "mysql-${MYSQL_VERSION}-linux-glibc2.28-x86_64" "$BASE_DIR"
else
  echo "MySQL ya está extraído en $BASE_DIR, salteo descarga/extracción."
fi

echo ""
echo "== 4) Inicialización del datadir (solo la primera vez) =="
mkdir -p "$DATA_DIR"
if [ -z "$(ls -A "$DATA_DIR" 2>/dev/null)" ]; then
  echo "Inicializando datadir vacío..."
  "$BASE_DIR/bin/mysqld" --initialize-insecure \
    --datadir="$DATA_DIR" \
    --basedir="$BASE_DIR"
  echo "Inicialización completa. Usuario root sin contraseña."
else
  echo "El datadir ya tiene datos, salteo inicialización."
fi

echo ""
echo "== 5) Arrancando el servidor MySQL =="
if [ -f "$PIDFILE" ] && kill -0 "$(cat "$PIDFILE")" 2>/dev/null; then
  echo "MySQL ya está corriendo (PID $(cat "$PIDFILE"))."
else
  cd "$BASE_DIR"
  ./bin/mysqld \
    --datadir="$DATA_DIR" \
    --basedir="$BASE_DIR" \
    --socket="$SOCKET" \
    --port="$PORT" \
    --pid-file="$PIDFILE" &

  echo "Esperando a que levante..."
  for i in $(seq 1 15); do
    if [ -S "$SOCKET" ]; then
      break
    fi
    sleep 1
  done
fi

echo ""
if [ -S "$SOCKET" ]; then
  echo "=========================================="
  echo " MySQL está corriendo"
  echo "   socket: $SOCKET"
  echo "   puerto: $PORT"
  echo "   usuario: root (sin contraseña)"
  echo "=========================================="
  echo ""
  echo "Para conectarte desde esta u otra terminal:"
  echo "  export LD_LIBRARY_PATH=$LIBFIX_DIR:\$LD_LIBRARY_PATH"
  echo "  $BASE_DIR/bin/mysql --socket=$SOCKET -u root"
  echo ""
  echo "Para pararlo más tarde:"
  echo "  $0 stop"
else
  echo "No pude confirmar que el socket se haya creado. Revisá los logs arriba"
  echo "por si hay algún ERROR (no confundir con los [Warning] normales)."
fi