-- Initialize database for Auth MERN application
USE test;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create user_details table for extended profiles
CREATE TABLE IF NOT EXISTS user_details (
    user_id INT PRIMARY KEY,
    about TEXT NULL,
    country VARCHAR(100) NULL,
    street_address VARCHAR(255) NULL,
    city VARCHAR(100) NULL,
    region VARCHAR(100) NULL,
    postal_code VARCHAR(32) NULL,
    avatar_url VARCHAR(255) NULL,
    cover_url VARCHAR(255) NULL,
    experiences JSON NULL,
    educations JSON NULL,
    certificates JSON NULL,
    projects JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_details_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
);

-- Insert test users (passwords are for "123456")
-- Note: These are properly hashed passwords using bcrypt
INSERT IGNORE INTO users (username, email, password_hash) VALUES 
('user1', 'userNo1@auth.com', '$2b$10$fAzTYxKYrV85uU6CufwKd.hYTFa1LYL8UVmNjJBFFq0DtA8yg3ZTG'),
('user2', 'userNo2@auth.com', '$2b$10$fAzTYxKYrV85uU6CufwKd.hYTFa1LYL8UVmNjJBFFq0DtA8yg3ZTG');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);