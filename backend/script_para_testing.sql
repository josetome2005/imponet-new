USE imponet;

-- =========================
-- LIMPIEZA (para poder re-ejecutar sin duplicados)
-- =========================
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE producto_imagenes;
TRUNCATE TABLE producto_categorias;
TRUNCATE TABLE detalle_ventas;
TRUNCATE TABLE ventas;
TRUNCATE TABLE productos;
TRUNCATE TABLE categorias;
TRUNCATE TABLE marcas;
SET FOREIGN_KEY_CHECKS = 1;

-- =========================
-- MARCAS
-- =========================
SET @marca_nike = UUID_TO_BIN(UUID());
SET @marca_adidas = UUID_TO_BIN(UUID());
SET @marca_puma = UUID_TO_BIN(UUID());
SET @marca_generic = UUID_TO_BIN(UUID());

INSERT INTO marcas (id, nombre, slug) VALUES
(@marca_nike,    'Nike', "nike"),
(@marca_adidas,  'Adidas', "adidas"),
(@marca_puma,    'Puma', "puma"),
(@marca_generic, 'Sin marca', "sin_marca");

-- =========================
-- CATEGORIAS
-- =========================
SET @cat_zapatillas = UUID_TO_BIN(UUID());
SET @cat_remeras   = UUID_TO_BIN(UUID());
SET @cat_pantalones = UUID_TO_BIN(UUID());
SET @cat_accesorios = UUID_TO_BIN(UUID());
SET @cat_running    = UUID_TO_BIN(UUID());

INSERT INTO categorias (id, nombre, slug) VALUES
(@cat_zapatillas, 'Zapatillas', "zapatillas"),
(@cat_remeras,    'Remeras', "remeras"),
(@cat_pantalones, 'Pantalones', "pantalones"),
(@cat_accesorios, 'Accesorios', "accesorios"),
(@cat_running,    'Running', "running");

-- =========================
-- PRODUCTOS
-- (destacado: 3 productos con destacado=1)
-- (oferta: 3 productos con descuento>0)
-- =========================
SET @prod_air          = UUID_TO_BIN(UUID());
SET @prod_ultraboost   = UUID_TO_BIN(UUID());
SET @prod_remera_puma  = UUID_TO_BIN(UUID());
SET @prod_pantalon     = UUID_TO_BIN(UUID());
SET @prod_medias       = UUID_TO_BIN(UUID());
SET @prod_zapatillas_puma = UUID_TO_BIN(UUID());
SET @prod_campera_nike = UUID_TO_BIN(UUID());
SET @prod_short_adidas = UUID_TO_BIN(UUID());

INSERT INTO productos
  (id, sku, marca_id, nombre, descripcion, precio, descuento, stock, dimensiones, extra, activo, destacado)
VALUES
-- Destacados (sin descuento, para que no se pisen con "en oferta")
(@prod_air, 'NIKE-AM90-001', @marca_nike,
   'Nike Air Max 90',
   'Zapatillas urbanas clásicas, cámara de aire visible.',
   145000, 0, 25, '40x30x15 cm', 'Colores: blanco/negro/rojo', 1, 1),
(@prod_campera_nike, 'NIKE-CMP-001', @marca_nike,
   'Campera Nike Windrunner',
   'Campera rompeviento liviana, ideal para entrenar.',
   98000, 0, 18, '35x25x8 cm', 'Talles: S/M/L/XL', 1, 1),
(@prod_zapatillas_puma, 'PUM-RSX-001', @marca_puma,
   'Puma RS-X',
   'Zapatillas retro running, diseño chunky.',
   132000, 0, 12, '40x30x15 cm', 'Colores: blanco/multicolor', 1, 1),

-- En oferta (descuento > 0)
(@prod_ultraboost, 'ADI-UB22-001', @marca_adidas,
   'Adidas Ultraboost 22',
   'Zapatillas de running con tecnología Boost.',
   189990, 20, 15, '40x30x15 cm', 'Colores: negro/gris', 1, 0),
(@prod_short_adidas, 'ADI-SHT-001', @marca_adidas,
   'Short Adidas Training',
   'Short deportivo transpirable, cintura elástica.',
   28000, 25, 40, '25x20x3 cm', 'Talles: S/M/L/XL', 1, 0),
(@prod_remera_puma, 'PUM-ESS-001', @marca_puma,
   'Remera Puma Essentials',
   'Remera deportiva de algodón, corte regular.',
   32000, 15, 50, '30x20x2 cm', 'Talles: S/M/L/XL', 1, 0),

-- Resto del catálogo (sin destacar, sin oferta)
(@prod_pantalon, 'GEN-JOG-001', @marca_generic,
   'Pantalón deportivo unisex',
   'Pantalón jogger con puños elásticos.',
   45000, 0, 30, '35x25x5 cm', 'Talles: S/M/L/XL', 1, 0),
(@prod_medias, 'GEN-MED-001', @marca_generic,
   'Pack medias deportivas x3',
   'Medias de algodón reforzadas en talón y punta.',
   12000, 0, 100, '20x15x5 cm', 'Talle único', 1, 0);

-- =========================
-- PRODUCTO_CATEGORIAS (relación N:M)
-- =========================
INSERT INTO producto_categorias (producto_id, categoria_id) VALUES
(@prod_air,              @cat_zapatillas),
(@prod_air,              @cat_running),
(@prod_ultraboost,       @cat_zapatillas),
(@prod_ultraboost,       @cat_running),
(@prod_zapatillas_puma,  @cat_zapatillas),
(@prod_remera_puma,      @cat_remeras),
(@prod_pantalon,         @cat_pantalones),
(@prod_medias,           @cat_accesorios),
(@prod_campera_nike,     @cat_accesorios),
(@prod_short_adidas,     @cat_pantalones);

-- =========================
-- PRODUCTO_IMAGENES
-- =========================
INSERT INTO producto_imagenes (id, producto_id, url, orden) VALUES
(UUID_TO_BIN(UUID()), @prod_air, '/img/productos/air-max-90-1.jpg', 0),
(UUID_TO_BIN(UUID()), @prod_air, '/img/productos/air-max-90-2.jpg', 1),
(UUID_TO_BIN(UUID()), @prod_ultraboost, '/img/productos/ultraboost-22-1.jpg', 0),
(UUID_TO_BIN(UUID()), @prod_remera_puma, '/img/productos/remera-puma-1.jpg', 0),
(UUID_TO_BIN(UUID()), @prod_pantalon, '/img/productos/pantalon-jogger-1.jpg', 0),
(UUID_TO_BIN(UUID()), @prod_medias, '/img/productos/medias-pack-1.jpg', 0),
(UUID_TO_BIN(UUID()), @prod_zapatillas_puma, '/img/productos/puma-rsx-1.jpg', 0),
(UUID_TO_BIN(UUID()), @prod_campera_nike, '/img/productos/campera-nike-1.jpg', 0),
(UUID_TO_BIN(UUID()), @prod_short_adidas, '/img/productos/short-adidas-1.jpg', 0);

-- =========================
-- VENTAS + DETALLE_VENTAS
-- (usuario_id = NULL en todas: compras de invitado, como definimos)
-- Precio_unitario ya calculado con descuento aplicado (igual que hace el backend real)
-- =========================
SET @venta_1 = UUID_TO_BIN(UUID());
SET @venta_2 = UUID_TO_BIN(UUID());
SET @venta_3 = UUID_TO_BIN(UUID());
SET @venta_4 = UUID_TO_BIN(UUID());

-- Venta 1: pendiente, 2 productos
INSERT INTO ventas (id, codigo, usuario_id, nombre, email, telefono, direccion_calle, direccion_ciudad, direccion_provincia, direccion_cp, total, estado, fecha)
VALUES (@venta_1, 'IMP-A1B2C3', NULL, 'Juan Pérez', 'juan.perez@email.com', '3511234567',
        'Av. Colón 1234', 'Córdoba', 'Córdoba', '5000', 145000 + (32000 * 0.85), 'pendiente', NOW() - INTERVAL 1 DAY);

INSERT INTO detalle_ventas (id, venta_id, producto_id, cantidad, precio_unitario) VALUES
(UUID_TO_BIN(UUID()), @venta_1, @prod_air, 1, 145000),
(UUID_TO_BIN(UUID()), @venta_1, @prod_remera_puma, 1, ROUND(32000 * 0.85));

-- Venta 2: pagado, 1 producto con descuento
INSERT INTO ventas (id, codigo, usuario_id, nombre, email, telefono, direccion_calle, direccion_ciudad, direccion_provincia, direccion_cp, total, estado, fecha)
VALUES (@venta_2, 'IMP-D4E5F6', NULL, 'María Gómez', 'maria.gomez@email.com', '3517654321',
        'San Martín 456', 'Villa Carlos Paz', 'Córdoba', '5152', ROUND(189990 * 0.80), 'pagado', NOW() - INTERVAL 3 DAY);

INSERT INTO detalle_ventas (id, venta_id, producto_id, cantidad, precio_unitario) VALUES
(UUID_TO_BIN(UUID()), @venta_2, @prod_ultraboost, 1, ROUND(189990 * 0.80));

-- Venta 3: entregado, 3 productos distintos
INSERT INTO ventas (id, codigo, usuario_id, nombre, email, telefono, direccion_calle, direccion_ciudad, direccion_provincia, direccion_cp, total, estado, fecha)
VALUES (@venta_3, 'IMP-G7H8J9', NULL, 'Carlos Ruiz', 'carlos.ruiz@email.com', '3519876543',
        'Belgrano 789', 'Río Cuarto', 'Córdoba', '5800', 45000 + 12000 + ROUND(28000 * 0.75), 'entregado', NOW() - INTERVAL 10 DAY);

INSERT INTO detalle_ventas (id, venta_id, producto_id, cantidad, precio_unitario) VALUES
(UUID_TO_BIN(UUID()), @venta_3, @prod_pantalon, 1, 45000),
(UUID_TO_BIN(UUID()), @venta_3, @prod_medias, 1, 12000),
(UUID_TO_BIN(UUID()), @venta_3, @prod_short_adidas, 1, ROUND(28000 * 0.75));

-- Venta 4: cancelado, para probar ese estado también
INSERT INTO ventas (id, codigo, usuario_id, nombre, email, telefono, direccion_calle, direccion_ciudad, direccion_provincia, direccion_cp, total, estado, fecha)
VALUES (@venta_4, 'IMP-K1L2M3', NULL, 'Lucía Fernández', 'lucia.fernandez@email.com', '3512223344',
        'Rivadavia 321', 'Córdoba', 'Córdoba', '5000', 132000, 'cancelado', NOW() - INTERVAL 5 DAY);

INSERT INTO detalle_ventas (id, venta_id, producto_id, cantidad, precio_unitario) VALUES
(UUID_TO_BIN(UUID()), @venta_4, @prod_zapatillas_puma, 1, 132000);

-- =========================
-- Verificación rápida — productos
-- =========================
SELECT
  BIN_TO_UUID(p.id) AS producto_id,
  p.sku,
  p.nombre,
  m.nombre AS marca,
  p.precio,
  p.descuento,
  p.destacado,
  p.stock,
  p.activo,
  GROUP_CONCAT(c.nombre SEPARATOR ', ') AS categorias
FROM productos p
LEFT JOIN marcas m ON m.id = p.marca_id
LEFT JOIN producto_categorias pc ON pc.producto_id = p.id
LEFT JOIN categorias c ON c.id = pc.categoria_id
GROUP BY p.id;

-- =========================
-- Verificación rápida — ventas
-- =========================
SELECT
  BIN_TO_UUID(v.id) AS venta_id,
  v.codigo,
  v.nombre,
  v.total,
  v.estado,
  v.fecha,
  COUNT(dv.id) AS cantidad_items
FROM ventas v
LEFT JOIN detalle_ventas dv ON dv.venta_id = v.id
GROUP BY v.id
ORDER BY v.fecha DESC;