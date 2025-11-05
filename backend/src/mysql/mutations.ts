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