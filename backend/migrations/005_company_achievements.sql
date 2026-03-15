-- Migration 005: Company achievements showcase for homepage
-- Run this migration after 004_articles_and_admin_role.sql

CREATE TABLE IF NOT EXISTS company_achievements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255) NULL,
    image_url VARCHAR(500) NOT NULL,
    display_order INT NOT NULL DEFAULT 0,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_company_achievements_active_order (is_active, display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed initial achievement images
INSERT INTO company_achievements (title, subtitle, image_url, display_order, is_active)
SELECT * FROM (
    SELECT 'Giải thưởng Công nghệ Thông tin TP.HCM 2017' AS title,
           'TP.HCM ICT Awards' AS subtitle,
           '/uploads/achievements/achievement-ict-award.jpg' AS image_url,
           1 AS display_order,
           1 AS is_active
    UNION ALL
    SELECT 'Bằng khen UBND TP.HCM',
           'Sản phẩm công nghệ tiêu biểu',
           '/uploads/achievements/achievement-certificate.png',
           2,
           1
    UNION ALL
    SELECT 'Tư duy Sáng tạo và Chuyển đổi số',
           'Liên hiệp các hội KHKT Việt Nam',
           '/uploads/achievements/achievement-trophy-gold.png',
           3,
           1
) AS seed
WHERE NOT EXISTS (SELECT 1 FROM company_achievements);
