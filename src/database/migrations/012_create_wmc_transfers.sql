CREATE TABLE IF NOT EXISTS wmc_transfers (
  id            CHAR(36) PRIMARY KEY,
  sender_id     CHAR(36) NOT NULL,
  recipient_id  CHAR(36) NOT NULL,
  amount        DECIMAL(12,2) NOT NULL,
  note          TEXT,
  status        ENUM('completed','reversed') NOT NULL DEFAULT 'completed',
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_transfer_sender (sender_id),
  INDEX idx_transfer_recipient (recipient_id),
  INDEX idx_transfer_created (created_at),
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (recipient_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE wellness_coin_ledger
  MODIFY COLUMN operation ENUM('earned','spent','expired','admin_adjustment','transferred') NOT NULL;
