ALTER TABLE users ADD COLUMN referral_code VARCHAR(20) UNIQUE AFTER unique_id;
ALTER TABLE users ADD COLUMN referred_by CHAR(36) AFTER referral_code;
ALTER TABLE users ADD INDEX idx_referral_code (referral_code);
ALTER TABLE users ADD INDEX idx_referred_by (referred_by);

CREATE TABLE IF NOT EXISTS referral_rewards (
  id          CHAR(36) PRIMARY KEY,
  referrer_id CHAR(36) NOT NULL,
  referred_id CHAR(36) NOT NULL,
  referred_subscription_id CHAR(36),
  reward_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  status      ENUM('pending','awarded') NOT NULL DEFAULT 'pending',
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  awarded_at  TIMESTAMP NULL,
  FOREIGN KEY (referrer_id) REFERENCES users(id),
  FOREIGN KEY (referred_id) REFERENCES users(id),
  INDEX idx_referrer (referrer_id),
  INDEX idx_referred (referred_id),
  INDEX idx_ref_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS admin_messages (
  id          CHAR(36) PRIMARY KEY,
  subject     VARCHAR(255) NOT NULL,
  body        TEXT NOT NULL,
  created_by  CHAR(36) NOT NULL,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id),
  INDEX idx_created_by (created_by)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS message_recipients (
  id          CHAR(36) PRIMARY KEY,
  message_id  CHAR(36) NOT NULL,
  user_id     CHAR(36) NOT NULL,
  read_at     TIMESTAMP NULL,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (message_id) REFERENCES admin_messages(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE KEY uk_msg_user (message_id, user_id),
  INDEX idx_user_messages (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
