import passport from 'passport';
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from 'passport-google-oauth20';
import { pool } from '../mysql/connection';
import { GET_USER_BY_EMAIL } from '../mysql/queries';
import { INSERT_USER_STATEMENT } from '../mysql/mutations';

/**
 * Google OAuth2 Configuration
 * Handles user authentication via Google OAuth 2.0
 */

// Validate required environment variables
const hasGoogleOAuthCredentials = Boolean(
    process.env.GOOGLE_CLIENT_ID && 
    process.env.GOOGLE_CLIENT_SECRET
);

if (!hasGoogleOAuthCredentials) {
    console.warn('⚠️  Google OAuth is DISABLED: GOOGLE_CLIENT_ID and/or GOOGLE_CLIENT_SECRET not set');
    console.warn('⚠️  OAuth endpoints will not be available. Set credentials in .env to enable Google OAuth.');
} else {
    console.log('✅ Google OAuth is ENABLED');
}

/**
 * Configure Google OAuth Strategy (only if credentials are provided)
 * When a user authenticates via Google:
 * 1. Google returns user profile data
 * 2. We check if user exists in our database (by email)
 * 3. If user exists, return their data
 * 4. If new user, create account with Google data
 */
if (hasGoogleOAuthCredentials) {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID!,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
                callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/v1/auth/google/callback',
                scope: ['profile', 'email']
            },
            async (
                accessToken: string,
                refreshToken: string,
                profile: Profile,
                done: VerifyCallback
            ) => {
                let conn;
                try {
                    // Extract user data from Google profile
                    const email = profile.emails?.[0]?.value;
                    const firstName = profile.name?.givenName || '';
                    const lastName = profile.name?.familyName || '';
                    const username = email?.split('@')[0] || `user_${profile.id}`;
                    const avatar_url = profile.photos?.[0]?.value || null;

                    if (!email) {
                        return done(new Error('Email not provided by Google'), undefined);
                    }

                    conn = await pool.getConnection();

                    // Check if user already exists
                    const [rows] = await conn.query(GET_USER_BY_EMAIL, [email]);
                    const users = rows as any[];

                    if (users && users.length > 0) {
                        // User exists, return existing user
                        const existingUser = users[0];
                        return done(null, {
                            id: existingUser.id,
                            email: existingUser.email,
                            username: existingUser.username,
                            isNewUser: false
                        });
                    }

                    // User doesn't exist, create new account
                    // Note: password_hash is null for OAuth users (they don't have a password)
                    const [result] = await conn.query(
                        INSERT_USER_STATEMENT,
                        [username, email, null] // null password_hash for OAuth users
                    );
                    
                    const newUserId = (result as any).insertId;

                    // Optionally insert initial user_details with avatar
                    if (avatar_url) {
                        await conn.query(
                            `INSERT INTO user_details (user_id, avatar_url) VALUES (?, ?)
                             ON DUPLICATE KEY UPDATE avatar_url = VALUES(avatar_url)`,
                            [newUserId, avatar_url]
                        );
                    }

                    // Return new user data
                    return done(null, {
                        id: newUserId,
                        email,
                        username,
                        isNewUser: true,
                        firstName,
                        lastName,
                        avatar_url
                    });

                } catch (error) {
                    console.error('Error in Google OAuth strategy:', error);
                    return done(error as Error, undefined);
                } finally {
                    if (conn) conn.release();
                }
            }
        )
    );
}

/**
 * Serialize user data into session
 * Only store minimal data (user ID) in session
 */
passport.serializeUser((user: any, done) => {
    done(null, user);
});

/**
 * Deserialize user data from session
 * Retrieve full user data using stored ID
 */
passport.deserializeUser((user: any, done) => {
    done(null, user);
});

export default passport;
export { hasGoogleOAuthCredentials };
