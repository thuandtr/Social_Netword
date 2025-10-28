-- Initialize database for Auth MERN application
USE test;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert test users (passwords are for "123456")
-- Note: These are properly hashed passwords using bcrypt
INSERT IGNORE INTO users (username, email, password_hash) VALUES 
('user1', 'userNo1@auth.com', '$2b$10$fAzTYxKYrV85uU6CufwKd.hYTFa1LYL8UVmNjJBFFq0DtA8yg3ZTG'),
('user2', 'userNo2@auth.com', '$2b$10$fAzTYxKYrV85uU6CufwKd.hYTFa1LYL8UVmNjJBFFq0DtA8yg3ZTG');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);