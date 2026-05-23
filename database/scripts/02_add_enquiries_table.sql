-- ============================================================
-- Run this in MySQL Workbench to fix the missing enquiries table
-- ============================================================

USE solar_solutions;

CREATE TABLE IF NOT EXISTS enquiries (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  reference_no    VARCHAR(20)     NOT NULL UNIQUE,
  enquiry_type    ENUM('residential','commercial') NOT NULL DEFAULT 'residential',

  -- Common
  name            VARCHAR(150),
  phone           VARCHAR(30),
  email           VARCHAR(255),
  city            VARCHAR(100),
  notes           TEXT,

  -- Residential
  state           VARCHAR(100),
  monthly_bill    VARCHAR(50),
  roof_type       VARCHAR(50),

  -- Commercial
  company_name    VARCHAR(200),
  contact_person  VARCHAR(150),
  business_type   VARCHAR(100),

  status          ENUM('new','contacted','converted','closed') NOT NULL DEFAULT 'new',
  admin_note      TEXT,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_type    (enquiry_type),
  INDEX idx_status  (status),
  INDEX idx_created (created_at)
) ENGINE=InnoDB;
