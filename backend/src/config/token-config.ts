/**
 * Centralized token configuration
 * Single source of truth for all token-related timeouts and security settings
 */

export const TOKEN_CONFIG = {
    // JWT expiration times (used by jsonwebtoken library)
    ACCESS_TOKEN_EXPIRES_IN: "1h",
    REFRESH_TOKEN_EXPIRES_IN: "30d",
    
    // Cookie expiration times in milliseconds (used by Express cookies)
    ACCESS_TOKEN_COOKIE_MAX_AGE: 60 * 60 * 1000, // 1 hour in ms
    REFRESH_TOKEN_COOKIE_MAX_AGE: 30 * 24 * 60 * 60 * 1000, // 30 days in ms
    
    // Cookie security settings
    COOKIE_SETTINGS: {
        httpOnly: true,
        path: "/",
        sameSite: 'lax' as const,
        secure: process.env.NODE_ENV === 'production'
    }
} as const;

/**
 * Helper function to get cookie expiration date
 */
export const getCookieExpiration = (maxAgeMs: number): Date => {
    return new Date(Date.now() + maxAgeMs);
};