-- Migration: Allow NULL password_hash for OAuth users
-- Run this if you have an existing database with users table

-- Check current schema
DESCRIBE users;

-- Modify password_hash column to allow NULL
ALTER TABLE users MODIFY COLUMN password_hash VARCHAR(255) NULL;

-- Verify the change
DESCRIBE users;

-- Optional: Add a column to track auth provider (for future use)
-- ALTER TABLE users ADD COLUMN auth_provider VARCHAR(50) DEFAULT 'local';
-- UPDATE users SET auth_provider = 'local' WHERE password_hash IS NOT NULL;
-- UPDATE users SET auth_provider = 'google' WHERE password_hash IS NULL;
