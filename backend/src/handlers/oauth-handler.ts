import { Request, Response } from 'express';
import { generateJWTToken, saveRefreshToken } from '../token/jwt-token-manager';
import { encryptData } from '../encryption';
import { setCookies } from './user-handler';

/**
 * OAuth Callback Handler
 * Called after successful Google authentication
 * Sets authentication tokens and redirects user
 */
export const googleAuthCallback = async (req: Request, res: Response) => {
    try {
        // User data is attached by passport after successful authentication
        const user = req.user as any;

        if (!user || !user.id || !user.email) {
            // Authentication failed or user data is missing
            console.error('OAuth callback: User data missing');
            return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=auth_failed`);
        }

        // Generate JWT tokens for the authenticated user
        const accessToken = generateJWTToken(user.id, user.email, 'access');
        const refreshToken = generateJWTToken(user.id, user.email, 'refresh');

        // Encrypt and store refresh token
        const encryptedRefreshToken = encryptData(refreshToken);
        await saveRefreshToken(refreshToken, encryptedRefreshToken);

        // Set authentication cookies
        setCookies(accessToken, encryptedRefreshToken, res);

        // Determine redirect URL based on whether this is a new user
        const redirectUrl = user.isNewUser 
            ? `${process.env.FRONTEND_URL || 'http://localhost:3000'}/update?welcome=true`
            : `${process.env.FRONTEND_URL || 'http://localhost:3000'}/profile`;

        // Redirect to frontend with success
        return res.redirect(redirectUrl);

    } catch (error) {
        console.error('Error in Google OAuth callback:', error);
        return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=server_error`);
    }
};

/**
 * OAuth Failure Handler
 * Called when Google authentication fails
 */
export const googleAuthFailure = (req: Request, res: Response) => {
    console.error('Google OAuth authentication failed');
    return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=oauth_failed`);
};
