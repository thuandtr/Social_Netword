import { Router } from 'express';
import passport from '../config/oauth-config';
import { googleAuthCallback, googleAuthFailure } from '../handlers/oauth-handler';

const oauthRouter = Router();

/**
 * Google OAuth Routes
 * /api/v1/auth/google - Initiates Google OAuth flow
 * /api/v1/auth/google/callback - Handles OAuth callback
 */

/**
 * @route   GET /api/v1/auth/google
 * @desc    Initiate Google OAuth authentication
 * @access  Public
 * 
 * When user clicks "Sign in with Google", redirect them here
 * This will redirect to Google's consent screen
 */
oauthRouter.get(
    '/google',
    passport.authenticate('google', { 
        scope: ['profile', 'email'],
        session: false // We use JWT tokens, not sessions
    })
);

/**
 * @route   GET /api/v1/auth/google/callback
 * @desc    Google OAuth callback URL
 * @access  Public
 * 
 * Google redirects here after user grants permission
 * We exchange the auth code for user data and create/login the user
 */
oauthRouter.get(
    '/google/callback',
    passport.authenticate('google', { 
        session: false,
        failureRedirect: '/api/v1/auth/google/failure'
    }),
    googleAuthCallback
);

/**
 * @route   GET /api/v1/auth/google/failure
 * @desc    Handle OAuth failure
 * @access  Public
 */
oauthRouter.get('/google/failure', googleAuthFailure);

export default oauthRouter;
