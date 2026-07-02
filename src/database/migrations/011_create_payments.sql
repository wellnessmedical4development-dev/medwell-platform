CREATE TABLE IF NOT EXISTS payments (
  id                CHAR(36) PRIMARY KEY,
  user_id           CHAR(36) NOT NULL,
  subscription_id   CHAR(36),
  amount            DECIMAL(12,2) NOT NULL,
  currency          VARCHAR(5) NOT NULL DEFAULT 'MAD',
  status            ENUM('pending','completed','failed','refunded') NOT NULL DEFAULT 'pending',
  payment_method    ENUM('card','transfer','wellness_coin') NOT NULL DEFAULT 'card',
  reference         VARCHAR(100) UNIQUE,
  simulated         BOOLEAN NOT NULL DEFAULT TRUE,
  paid_at           TIMESTAMP NULL,
  metadata          JSON,
  created_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_payments_user (user_id),
  INDEX idx_payments_subscription (subscription_id),
  INDEX idx_payments_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
