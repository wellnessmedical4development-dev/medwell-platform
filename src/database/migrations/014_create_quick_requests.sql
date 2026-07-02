CREATE TABLE quick_requests (
  id CHAR(36) PRIMARY KEY,
  user_id CHAR(36) DEFAULT NULL,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  gender ENUM('homme', 'femme') NOT NULL DEFAULT 'homme',
  service_requested VARCHAR(200) DEFAULT NULL,
  preferred_call_date DATE DEFAULT NULL,
  preferred_call_time VARCHAR(10) DEFAULT NULL,
  status ENUM('pending_call', 'call_attempted', 'confirmed') DEFAULT 'pending_call',
  internal_notes TEXT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_qr_phone (phone),
  INDEX idx_qr_status (status),
  INDEX idx_qr_user (user_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
