-- Table pour la galerie d'images centralisée
CREATE TABLE IF NOT EXISTS images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  url VARCHAR(500) NOT NULL,
  title VARCHAR(255),
  alt_text VARCHAR(255),
  tags TEXT COMMENT 'Mots-clés séparés par des virgules',
  file_size INT COMMENT 'Taille en bytes',
  mime_type VARCHAR(100),
  width INT,
  height INT,
  uploaded_by VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_tags (tags(255)),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
