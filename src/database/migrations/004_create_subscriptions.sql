-- 004_create_subscriptions.sql
CREATE TABLE IF NOT EXISTS subscriptions (
  id                CHAR(36) PRIMARY KEY,
  user_id           CHAR(36) NOT NULL,
  service_id        CHAR(36) NOT NULL,
  status            ENUM('active','expired','cancelled','pending') NOT NULL DEFAULT 'pending',
  amount            DECIMAL(10,2) NOT NULL,
  currency          VARCHAR(3) NOT NULL DEFAULT 'MAD',
  `interval`        VARCHAR(20) NOT NULL DEFAULT 'monthly',
  start_date        DATE NOT NULL,
  end_date          DATE NOT NULL,
  auto_renew        BOOLEAN NOT NULL DEFAULT FALSE,
  notes             TEXT,
  cancelled_at      TIMESTAMP NULL,
  created_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_subscriptions_user (user_id),
  INDEX idx_subscriptions_service (service_id),
  INDEX idx_subscriptions_status (status),
  INDEX idx_subscriptions_dates (start_date, end_date),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
