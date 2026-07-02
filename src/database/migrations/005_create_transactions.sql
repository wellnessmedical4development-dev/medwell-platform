-- 005_create_transactions.sql
CREATE TABLE IF NOT EXISTS transactions (
  id                CHAR(36) PRIMARY KEY,
  user_id           CHAR(36) NOT NULL,
  subscription_id   CHAR(36),
  type              ENUM('payment','refund','wellness_coin_credit','wellness_coin_debit','subscription_renewal','subscription_cancellation') NOT NULL,
  amount            DECIMAL(12,2) NOT NULL,
  currency          VARCHAR(3) NOT NULL DEFAULT 'MAD',
  description       TEXT,
  reference         VARCHAR(100) UNIQUE,
  metadata          JSON,
  created_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_transactions_user (user_id),
  INDEX idx_transactions_type (type),
  INDEX idx_transactions_created (created_at),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (subscription_id) REFERENCES subscriptions(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
