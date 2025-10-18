export const GET_USER_BY_ID = `
    SELECT id, username, email, created_at FROM users WHERE id = ?;
`;

export const GET_ALL_USERS = `
    SELECT id, username, email, created_at FROM users ORDER BY created_at DESC;
`;

