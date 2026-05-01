CREATE DATABASE IF NOT EXISTS auth_v2
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE auth_v2;

CREATE TABLE IF NOT EXISTS users (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name         VARCHAR(100)  NOT NULL,
  email        VARCHAR(255)  NOT NULL UNIQUE,
  phone        VARCHAR(20)   NULL UNIQUE,
  passwordHash VARCHAR(255)  NOT NULL,
  role         ENUM('user','admin') NOT NULL DEFAULT 'user',
  isVerified   TINYINT(1)    NOT NULL DEFAULT 0,
  lastLoginAt  DATETIME      NULL,
  createdAt    DATETIME      NOT NULL,
  updatedAt    DATETIME      NOT NULL,
  INDEX idx_users_email (email),
  INDEX idx_users_phone (phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;