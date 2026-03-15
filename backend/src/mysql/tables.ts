export const CREATE_TABLE_USERS = `CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NULL,
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

export const CREATE_TABLE_NEWSFEED_ACTIVITIES = `CREATE TABLE IF NOT EXISTS newsfeed_activities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    activity_type ENUM('education_added', 'education_completed', 'job_started', 'job_ended', 'certificate_earned', 'project_created', 'project_updated', 'profile_updated') NOT NULL,
    activity_data JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_newsfeed_activities_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
);`;

export const CREATE_TABLE_ACTIVITIES = `CREATE TABLE IF NOT EXISTS activities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    activity_type ENUM(
        'education_added',
        'education_completed',
        'job_started',
        'job_ended',
        'certificate_earned',
        'project_created',
        'project_updated',
        'profile_updated'
    ) NOT NULL,
    activity_data JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_activity_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE,
    INDEX idx_created_at (created_at DESC),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`;

export const CREATE_TABLE_ACTIVITY_REACTIONS = `CREATE TABLE IF NOT EXISTS activity_reactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    activity_id INT NOT NULL,
    user_id INT NOT NULL,
    emoji VARCHAR(10) DEFAULT '🎉',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_reaction_activity
        FOREIGN KEY (activity_id) REFERENCES activities(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_reaction_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE,
    UNIQUE KEY unique_user_activity_reaction (activity_id, user_id),
    INDEX idx_activity_id (activity_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`;

export const CREATE_TABLE_ACTIVITY_COMMENTS = `CREATE TABLE IF NOT EXISTS activity_comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    activity_id INT NOT NULL,
    author_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_comment_activity
        FOREIGN KEY (activity_id) REFERENCES activities(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_comment_author
        FOREIGN KEY (author_id) REFERENCES users(id)
        ON DELETE CASCADE,
    INDEX idx_activity_id (activity_id),
    INDEX idx_created_at (created_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`;

export const CREATE_TABLE_COLLABORATION_REQUESTS = `CREATE TABLE IF NOT EXISTS collaboration_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_owner_id INT NOT NULL,
    requester_id INT NOT NULL,
    activity_id INT NOT NULL,
    status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_collab_owner
        FOREIGN KEY (project_owner_id) REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_collab_requester
        FOREIGN KEY (requester_id) REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_collab_activity
        FOREIGN KEY (activity_id) REFERENCES activities(id)
        ON DELETE CASCADE,
    UNIQUE KEY unique_requester_activity (requester_id, activity_id),
    INDEX idx_owner_status (project_owner_id, status),
    INDEX idx_requester (requester_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`;

export const CREATE_TABLE_PROJECT_CONTRIBUTORS = `CREATE TABLE IF NOT EXISTS project_contributors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    project_name VARCHAR(255) NOT NULL,
    role VARCHAR(100),
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_contributor_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE,
    INDEX idx_user_project (user_id, project_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`;

export const CREATE_TABLE_ARTICLES = `CREATE TABLE IF NOT EXISTS articles (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`;

export const CREATE_TABLE_COMPANY_ACHIEVEMENTS = `CREATE TABLE IF NOT EXISTS company_achievements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255) NULL,
    image_url VARCHAR(500) NOT NULL,
    display_order INT NOT NULL DEFAULT 0,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_company_achievements_active_order (is_active, display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`;
