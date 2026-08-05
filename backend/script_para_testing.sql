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

INSERT INTO marcas (id, nombre) VALUES
(@marca_nike,    'Nike'),
(@marca_adidas,  'Adidas'),
(@marca_puma,    'Puma'),
(@marca_generic, 'Sin marca');

-- =========================
-- CATEGORIAS
-- =========================
SET @cat_zapatillas = UUID_TO_BIN(UUID());
SET @cat_remeras   = UUID_TO_BIN(UUID());
SET @cat_pantalones = UUID_TO_BIN(UUID());
SET @cat_accesorios = UUID_TO_BIN(UUID());
SET @cat_running    = UUID_TO_BIN(UUID());

INSERT INTO categorias (id, nombre) VALUES
(@cat_zapatillas, 'Zapatillas'),
(@cat_remeras,    'Remeras'),
(@cat_pantalones, 'Pantalones'),
(@cat_accesorios, 'Accesorios'),
(@cat_running,    'Running');

-- =========================
-- PRODUCTOS
-- =========================
SET @prod_air = UUID_TO_BIN(UUID());
SET @prod_ultraboost = UUID_TO_BIN(UUID());
SET @prod_remera_puma = UUID_TO_BIN(UUID());
SET @prod_pantalon = UUID_TO_BIN(UUID());
SET @prod_medias = UUID_TO_BIN(UUID());

INSERT INTO productos
  (id, sku, marca_id, nombre, descripcion, precio, descuento, stock, dimensiones, extra, activo)
VALUES
(@prod_air, 'NIKE-AM90-001', @marca_nike,
   'Nike Air Max 90',
   'Zapatillas urbanas clásicas, cámara de aire visible.',
   145000, 10, 25, '40x30x15 cm', 'Colores: blanco/negro/rojo', 1),

(@prod_ultraboost, 'ADI-UB22-001', @marca_adidas,
   'Adidas Ultraboost 22',
   'Zapatillas de running con tecnología Boost.',
   189990, 0, 15, '40x30x15 cm', 'Colores: negro/gris', 1),

(@prod_remera_puma, 'PUM-ESS-001', @marca_puma,
   'Remera Puma Essentials',
   'Remera deportiva de algodón, corte regular.',
   32000, 15, 50, '30x20x2 cm', 'Talles: S/M/L/XL', 0),

(@prod_pantalon, 'GEN-JOG-001', @marca_generic,
   'Pantalón deportivo unisex',
   'Pantalón jogger con puños elásticos.',
   45000, 0, 30, '35x25x5 cm', 'Talles: S/M/L/XL', 1),

(@prod_medias, 'GEN-MED-001', @marca_generic,
   'Pack medias deportivas x3',
   'Medias de algodón reforzadas en talón y punta.',
   12000, 0, 100, '20x15x5 cm', 'Talle único', 1);

-- =========================
-- PRODUCTO_CATEGORIAS (relación N:M)
-- =========================
INSERT INTO producto_categorias (producto_id, categoria_id) VALUES
(@prod_air,         @cat_zapatillas),
(@prod_air,         @cat_running),

(@prod_ultraboost,  @cat_zapatillas),
(@prod_ultraboost,  @cat_running),

(@prod_remera_puma, @cat_remeras),

(@prod_pantalon,    @cat_pantalones),

(@prod_medias,       @cat_accesorios);

-- =========================
-- PRODUCTO_IMAGENES
-- =========================
INSERT INTO producto_imagenes (id, producto_id, url, orden) VALUES
(UUID_TO_BIN(UUID()), @prod_air, '/img/productos/air-max-90-1.jpg', 0),
(UUID_TO_BIN(UUID()), @prod_air, '/img/productos/air-max-90-2.jpg', 1),

(UUID_TO_BIN(UUID()), @prod_ultraboost, '/img/productos/ultraboost-22-1.jpg', 0),

(UUID_TO_BIN(UUID()), @prod_remera_puma, '/img/productos/remera-puma-1.jpg', 0),

(UUID_TO_BIN(UUID()), @prod_pantalon, '/img/productos/pantalon-jogger-1.jpg', 0),

(UUID_TO_BIN(UUID()), @prod_medias, '/img/productos/medias-pack-1.jpg', 0);

-- =========================
-- Verificación rápida
-- =========================
SELECT
  BIN_TO_UUID(p.id) AS producto_id,
  p.sku,
  p.nombre,
  m.nombre AS marca,
  p.precio,
  p.stock,
  p.activo,
  GROUP_CONCAT(c.nombre SEPARATOR ', ') AS categorias
FROM productos p
LEFT JOIN marcas m ON m.id = p.marca_id
LEFT JOIN producto_categorias pc ON pc.producto_id = p.id
LEFT JOIN categorias c ON c.id = pc.categoria_id
GROUP BY p.id;