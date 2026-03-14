export const INSERT_USER_STATEMENT = `
INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?);
`

export const UPSERT_USER_DETAILS_STATEMENT = `
INSERT INTO user_details (
	user_id,
	about,
	country,
	street_address,
	city,
	region,
	postal_code,
	avatar_url,
	cover_url,
	experiences,
	educations,
	certificates,
	projects
)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
ON DUPLICATE KEY UPDATE
	about = VALUES(about),
	country = VALUES(country),
	street_address = VALUES(street_address),
	city = VALUES(city),
	region = VALUES(region),
	postal_code = VALUES(postal_code),
	avatar_url = VALUES(avatar_url),
	cover_url = VALUES(cover_url),
	experiences = VALUES(experiences),
	educations = VALUES(educations),
	certificates = VALUES(certificates),
	projects = VALUES(projects),
	updated_at = CURRENT_TIMESTAMP;
`

export const UPDATE_USER_BASIC_BY_ID = `
UPDATE users SET username = ?, email = ? WHERE id = ?;
`

// Activity mutations
export const INSERT_ACTIVITY = `
INSERT INTO activities (user_id, activity_type, activity_data) 
VALUES (?, ?, ?);
`;

export const INSERT_ACTIVITY_REACTION = `
INSERT INTO activity_reactions (activity_id, user_id, emoji) 
VALUES (?, ?, ?);
`;

export const DELETE_ACTIVITY_REACTION = `
DELETE FROM activity_reactions 
WHERE activity_id = ? AND user_id = ?;
`;

export const INSERT_ACTIVITY_COMMENT = `
INSERT INTO activity_comments (activity_id, author_id, content) 
VALUES (?, ?, ?);
`;

export const INSERT_COLLABORATION_REQUEST = `
INSERT INTO collaboration_requests 
(project_owner_id, requester_id, activity_id, message) 
VALUES (?, ?, ?, ?);
`;

export const UPDATE_COLLABORATION_REQUEST_STATUS = `
UPDATE collaboration_requests SET status = ? WHERE id = ?;
`;

export const INSERT_PROJECT_CONTRIBUTOR = `
INSERT INTO project_contributors (user_id, project_name, role) 
VALUES (?, ?, ?);
`;

export const UPDATE_ACTIVITY = `
UPDATE activities SET activity_data = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?;
`;

export const DELETE_ACTIVITY = `
DELETE FROM activities WHERE id = ? AND user_id = ?;
`;

// Article mutations for company website
export const INSERT_ARTICLE = `
INSERT INTO articles (title, content, excerpt, thumbnail_url, author_id, status, category, tags)
VALUES (?, ?, ?, ?, ?, ?, ?, ?);
`;

export const UPDATE_ARTICLE = `
UPDATE articles
SET title = ?, content = ?, excerpt = ?, thumbnail_url = ?, status = ?, category = ?, tags = ?, updated_at = NOW()
WHERE id = ?;
`;

export const DELETE_ARTICLE = `
DELETE FROM articles WHERE id = ?;
`;
