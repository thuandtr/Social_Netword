export const INSERT_USER_STATEMENT = `
INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?);
`