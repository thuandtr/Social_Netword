export const GET_USER_BY_ID = `
    SELECT id, username, email, created_at FROM users WHERE id = ?;
`;

export const GET_USER_BY_EMAIL = `
    SELECT username, email, password_hash FROM users WHERE email = ?;
`;