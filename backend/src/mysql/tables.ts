export const CREATE_TABLE_USERS = `CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`;
 
export const CREATE_TABLE_USER_DETAILS = `CREATE TABLE IF NOT EXISTS user_details (
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
);`;