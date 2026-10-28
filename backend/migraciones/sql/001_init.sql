-- 001: tablas base de la aplicación
CREATE TABLE IF NOT EXISTS marcas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS coches (
  id INT AUTO_INCREMENT PRIMARY KEY,
  marca_id INT NOT NULL,
  modelo VARCHAR(80) NOT NULL,
  anio INT NOT NULL,
  precio DECIMAL(12, 2) NOT NULL,
  color VARCHAR(30) NOT NULL,
  puertas INT NOT NULL,
  combustible ENUM('gasolina', 'diesel', 'electrico', 'hibrido', 'gas') NOT NULL,
  imagen VARCHAR(255) NULL,
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_coche_marca_modelo_anio (marca_id, modelo, anio),
  KEY idx_coches_marca (marca_id),
  KEY idx_coches_precio (precio),
  KEY idx_coches_anio (anio),
  CONSTRAINT fk_coches_marca FOREIGN KEY (marca_id) REFERENCES marcas (id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
