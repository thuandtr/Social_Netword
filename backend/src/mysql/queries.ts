export const GET_USER_BY_ID = `
    SELECT id, username, email, created_at FROM users WHERE id = ?;
`;

export const GET_USER_BY_EMAIL = `
    SELECT username, email, password_hash, id FROM users WHERE email = ?;
`;

export const GET_USER_BY_USERNAME = `
    SELECT id, username, email, created_at FROM users WHERE username = ?;
`;