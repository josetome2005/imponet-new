DROP DATABASE IF EXISTS imponet;
CREATE DATABASE imponet;
USE imponet;

-- Categorías
CREATE TABLE categorias (
  id BINARY(16) NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_categoria_nombre (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

-- Marcas
CREATE TABLE marcas (
  id BINARY(16) NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_marca_nombre (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

-- Productos (ya sin listas *-separadas)
CREATE TABLE productos (
  id BINARY(16) NOT NULL,
  marca_id BINARY(16) DEFAULT NULL,
  nombre VARCHAR(150) NOT NULL,
  descripcion TEXT,
  precio INT NOT NULL,
  descuento INT NOT NULL DEFAULT 0,
  stock INT NOT NULL DEFAULT 0,
  dimensiones VARCHAR(50) DEFAULT NULL,
  extra VARCHAR(100) DEFAULT NULL,
  activo BOOLEAN NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_producto_marca (marca_id),
  CONSTRAINT fk_producto_marca FOREIGN KEY (marca_id) REFERENCES marcas(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

-- Pivote producto <-> categoría (un producto puede tener varias)
CREATE TABLE producto_categorias (
  producto_id BINARY(16) NOT NULL,
  categoria_id BINARY(16) NOT NULL,
  PRIMARY KEY (producto_id, categoria_id),
  CONSTRAINT fk_pc_producto FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
  CONSTRAINT fk_pc_categoria FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

-- Imágenes de producto (antes era un varchar con *)
CREATE TABLE producto_imagenes (
  id BINARY(16) NOT NULL,
  producto_id BINARY(16) NOT NULL,
  url VARCHAR(255) NOT NULL,
  orden INT NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  KEY idx_pi_producto (producto_id),
  CONSTRAINT fk_pi_producto FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

-- Usuarios (ahora con auth real)
CREATE TABLE usuarios (
  id BINARY(16) NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL,
  password VARCHAR(255) NOT NULL,
  telefono VARCHAR(20) DEFAULT NULL,
  rol ENUM('cliente','admin') NOT NULL DEFAULT 'cliente',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_usuario_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

-- Direcciones de envío
CREATE TABLE direcciones (
  id BINARY(16) NOT NULL,
  usuario_id BINARY(16) NOT NULL,
  calle VARCHAR(150) NOT NULL,
  ciudad VARCHAR(100) NOT NULL,
  provincia VARCHAR(100) NOT NULL,
  cp VARCHAR(20) NOT NULL,
  pais VARCHAR(100) NOT NULL DEFAULT 'Argentina',
  predeterminada BOOLEAN NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  KEY idx_dir_usuario (usuario_id),
  CONSTRAINT fk_dir_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

-- Ventas (cabecera)
CREATE TABLE ventas (
  id BINARY(16) NOT NULL,
  usuario_id BINARY(16) DEFAULT NULL,
  direccion_id BINARY(16) DEFAULT NULL,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  telefono VARCHAR(20) DEFAULT NULL,
  total INT NOT NULL DEFAULT 0,
  estado ENUM('pendiente','pagado','enviado','entregado','cancelado') NOT NULL DEFAULT 'pendiente',
  fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_venta_usuario (usuario_id),
  CONSTRAINT fk_venta_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
  CONSTRAINT fk_venta_direccion FOREIGN KEY (direccion_id) REFERENCES direcciones(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

-- Detalle de venta (line items — antes era un varchar de ids)
CREATE TABLE detalle_ventas (
  id BINARY(16) NOT NULL,
  venta_id BINARY(16) NOT NULL,
  producto_id BINARY(16) NOT NULL,
  cantidad INT NOT NULL,
  precio_unitario INT NOT NULL,
  PRIMARY KEY (id),
  KEY idx_dv_venta (venta_id),
  KEY idx_dv_producto (producto_id),
  CONSTRAINT fk_dv_venta FOREIGN KEY (venta_id) REFERENCES ventas(id) ON DELETE CASCADE,
  CONSTRAINT fk_dv_producto FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;