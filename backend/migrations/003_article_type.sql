-- Migration 003: Add article_posted activity type and updated_at timestamp
-- Enables sharing and editing articles from company websites

ALTER TABLE activities
MODIFY COLUMN activity_type ENUM(
    'education_added',
    'education_completed',
    'job_started',
    'job_ended',
    'certificate_earned',
    'project_created',
    'project_updated',
    'profile_updated',
    'article_posted'
) NOT NULL;

ALTER TABLE activities
ADD COLUMN updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP;
