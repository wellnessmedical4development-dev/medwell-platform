-- 006_create_wellness_coins.sql
CREATE TABLE IF NOT EXISTS wellness_coin_ledger (
  id                CHAR(36) PRIMARY KEY,
  user_id           CHAR(36) NOT NULL,
  operation         ENUM('earned','spent','expired','admin_adjustment') NOT NULL,
  amount            DECIMAL(12,2) NOT NULL,
  running_balance   DECIMAL(12,2) NOT NULL,
  reference_type    VARCHAR(50),
  reference_id      CHAR(36),
  description       TEXT,
  created_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_coin_ledger_user (user_id),
  INDEX idx_coin_ledger_created (created_at),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
