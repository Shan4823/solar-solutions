

-- ============================================================
-- Table: users
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  full_name       VARCHAR(150)    NOT NULL,
  email           VARCHAR(255)    NOT NULL UNIQUE,
  phone           VARCHAR(20),
  password_hash   VARCHAR(255)    NOT NULL,
  role            ENUM('user','admin') NOT NULL DEFAULT 'user',
  is_active       TINYINT(1)      NOT NULL DEFAULT 1,
  created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email     (email),
  INDEX idx_role      (role),
  INDEX idx_is_active (is_active)
) ENGINE=InnoDB;

-- ============================================================
-- Table: applications  (installation requests)
-- ============================================================
CREATE TABLE IF NOT EXISTS applications (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  reference_no    VARCHAR(20)     NOT NULL UNIQUE,
  user_id         INT UNSIGNED    NOT NULL,
  app_type        ENUM('residential','commercial') NOT NULL DEFAULT 'residential',

  -- Residential fields
  city            VARCHAR(100),
  state           VARCHAR(100),
  monthly_bill    VARCHAR(50),
  roof_type       VARCHAR(50),
  notes           TEXT,

  -- Commercial fields
  company_name    VARCHAR(200),
  contact_person  VARCHAR(150),
  business_type   VARCHAR(100),

  -- System estimate
  system_size     VARCHAR(30),
  subsidy_amount  VARCHAR(30),

  status          ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  admin_note      TEXT,
  reviewed_by     INT UNSIGNED,
  reviewed_at     DATETIME,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_app_user   FOREIGN KEY (user_id)     REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT fk_app_admin  FOREIGN KEY (reviewed_by) REFERENCES users (id) ON DELETE SET NULL,
  INDEX idx_user_id    (user_id),
  INDEX idx_status     (status),
  INDEX idx_app_type   (app_type),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB;

-- ============================================================
-- Seed: Default admin account
-- Password: Admin@1234
-- ============================================================
INSERT INTO users (full_name, email, phone, password_hash, role)
VALUES (
  'Solar Admin',
  'admin@solarsolutions.in',
  '1800-180-3333',
  '$2b$12$dtaVhf7HAfLTLCpNTomxSejv/rCScOfWB4DvzSL7aahYa9YMiEYKO',
  'admin'
);

-- ============================================================
-- Seed: Demo user account
-- Password: User@1234
-- ============================================================
INSERT INTO users (full_name, email, phone, password_hash, role)
VALUES (
  'Rajesh Kumar',
  'user@solarsolutions.in',
  '98765 43210',
  '$2b$12$z2mXhedM76bepcX6BqiK4OuGq1dOYVa8PrhUnxDd4assL5YEtl4ui',
  'user'
);

-- ============================================================
-- Seed: Demo applications linked to the demo user
-- ============================================================
INSERT INTO applications
  (reference_no, user_id, app_type, city, state, monthly_bill, roof_type, system_size, subsidy_amount, status)
VALUES
  ('SR-0001', 2, 'residential', 'Bengaluru', 'Karnataka', '₹2,000–₹5,000', 'RCC Flat', '3 kW', '₹78,000', 'pending'),
  ('SR-0002', 2, 'residential', 'Bengaluru', 'Karnataka', 'Above ₹5,000',  'RCC Flat', '5 kW', '₹78,000', 'approved');

COMMIT;

-- ============================================================
-- Table: enquiries  (public contact form – no login required)
-- ============================================================
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

  INDEX idx_type      (enquiry_type),
  INDEX idx_status    (status),
  INDEX idx_created   (created_at)
) ENGINE=InnoDB;
