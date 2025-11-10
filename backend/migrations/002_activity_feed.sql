-- Migration: Activity Feed System
-- Description: Creates tables for tracking user activities and enabling automatic post generation

-- Activity Feed Table
-- Stores automatic activities generated from profile updates
CREATE TABLE IF NOT EXISTS activities (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Activity Reactions Table
-- Stores reactions to activities (single emoji per user per activity)
CREATE TABLE IF NOT EXISTS activity_reactions (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Activity Comments Table
-- Stores comments on activities
CREATE TABLE IF NOT EXISTS activity_comments (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Collaboration Requests Table
-- Stores project collaboration requests
CREATE TABLE IF NOT EXISTS collaboration_requests (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Project Contributors Table
-- Tracks approved contributors for projects
CREATE TABLE IF NOT EXISTS project_contributors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    project_name VARCHAR(255) NOT NULL,
    role VARCHAR(100),
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_contributor_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE,
    INDEX idx_user_project (user_id, project_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
