-- 003_create_services.sql
CREATE TABLE IF NOT EXISTS services (
  id                CHAR(36) PRIMARY KEY,
  code              VARCHAR(50) UNIQUE NOT NULL,
  title             JSON NOT NULL,
  description       JSON NOT NULL,
  short_desc        JSON,
  category          VARCHAR(100),
  price             DECIMAL(10,2) NOT NULL,
  currency          VARCHAR(3) NOT NULL DEFAULT 'MAD',
  duration_days     INT NOT NULL,
  is_active         BOOLEAN NOT NULL DEFAULT TRUE,
  image_url         TEXT,
  wellness_coin_reward DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  whatsapp_template_key VARCHAR(100),
  created_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_services_active (is_active),
  INDEX idx_services_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
