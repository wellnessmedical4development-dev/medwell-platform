CREATE TABLE IF NOT EXISTS otp_codes (
  id          CHAR(36) PRIMARY KEY,
  phone       VARCHAR(20) NOT NULL,
  code        VARCHAR(8) NOT NULL,
  purpose     ENUM('registration','login','password_reset') NOT NULL DEFAULT 'registration',
  verified    BOOLEAN NOT NULL DEFAULT FALSE,
  attempts    INT NOT NULL DEFAULT 0,
  expires_at  TIMESTAMP NOT NULL,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_otp_phone (phone),
  INDEX idx_otp_purpose (purpose)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
