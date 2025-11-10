export const GET_USER_BY_ID = `
    SELECT id, username, email, created_at FROM users WHERE id = ?;
`;

export const GET_USER_BY_EMAIL = `
    SELECT username, email, password_hash, id FROM users WHERE email = ?;
`;

export const GET_USER_BY_USERNAME = `
    SELECT id, username, email, created_at FROM users WHERE username = ?;
`;

// Activity queries
export const GET_ACTIVITIES = `
    SELECT 
        a.id,
        a.user_id,
        a.activity_type,
        a.activity_data,
        a.created_at,
        u.username,
        ud.avatar_url
    FROM activities a
    JOIN users u ON a.user_id = u.id
    LEFT JOIN user_details ud ON u.id = ud.user_id
    ORDER BY a.created_at DESC
    LIMIT ? OFFSET ?;
`;

export const GET_ACTIVITY_BY_ID = `
    SELECT 
        a.id,
        a.user_id,
        a.activity_type,
        a.activity_data,
        a.created_at,
        u.username,
        ud.avatar_url
    FROM activities a
    JOIN users u ON a.user_id = u.id
    LEFT JOIN user_details ud ON u.id = ud.user_id
    WHERE a.id = ?;
`;

export const GET_ACTIVITY_REACTIONS = `
    SELECT 
        activity_id,
        emoji,
        COUNT(*) as count,
        MAX(CASE WHEN user_id = ? THEN 1 ELSE 0 END) as user_reacted
    FROM activity_reactions
    WHERE activity_id IN (?)
    GROUP BY activity_id, emoji;
`;

export const GET_ACTIVITY_COMMENTS = `
    SELECT 
        ac.id,
        ac.activity_id,
        ac.content,
        ac.created_at,
        u.username,
        ud.avatar_url
    FROM activity_comments ac
    JOIN users u ON ac.author_id = u.id
    LEFT JOIN user_details ud ON u.id = ud.user_id
    WHERE ac.activity_id IN (?)
    ORDER BY ac.created_at ASC;
`;

export const GET_USER_REACTION = `
    SELECT id FROM activity_reactions 
    WHERE activity_id = ? AND user_id = ?;
`;

export const GET_COLLABORATION_REQUESTS = `
    SELECT 
        cr.id,
        cr.status,
        cr.message,
        cr.created_at,
        cr.activity_id,
        u.username as requester_username,
        ud.avatar_url as requester_avatar,
        a.activity_data
    FROM collaboration_requests cr
    JOIN users u ON cr.requester_id = u.id
    LEFT JOIN user_details ud ON u.id = ud.user_id
    JOIN activities a ON cr.activity_id = a.id
    WHERE cr.project_owner_id = ? AND cr.status = ?
    ORDER BY cr.created_at DESC;
`;

export const GET_COLLABORATION_REQUEST_BY_ID = `
    SELECT project_owner_id, requester_id, activity_id 
    FROM collaboration_requests WHERE id = ?;
`;

export const CHECK_EXISTING_COLLABORATION_REQUEST = `
    SELECT id, status FROM collaboration_requests 
    WHERE requester_id = ? AND activity_id = ?;
`;