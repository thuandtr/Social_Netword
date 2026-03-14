-- Migration 004: Company website articles table + admin role
-- Run this migration after 003_article_type.sql

-- Add role column to users table if it doesn't exist
ALTER TABLE users ADD COLUMN role ENUM('user', 'admin') NOT NULL DEFAULT 'user';

-- Create articles table for company website content
CREATE TABLE IF NOT EXISTS articles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    content LONGTEXT NOT NULL,
    excerpt VARCHAR(1000) NULL,
    thumbnail_url VARCHAR(500) NULL,
    author_id INT NOT NULL,
    status ENUM('draft', 'published') NOT NULL DEFAULT 'draft',
    category VARCHAR(100) NULL,
    tags JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_article_author
        FOREIGN KEY (author_id) REFERENCES users(id)
        ON DELETE CASCADE,
    INDEX idx_status (status),
    INDEX idx_created_at (created_at DESC),
    INDEX idx_author (author_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
