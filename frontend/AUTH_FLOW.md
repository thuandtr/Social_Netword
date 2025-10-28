# Authentication Flow Documentation

## Overview
This application implements a secure authentication system with automatic token refresh and route protection.

## Authentication Flow Logic

### 1. **Login/Signup Flow**
- User visits `/login` or `/signup` page
- User submits credentials
- Backend validates credentials and issues:
  - `access_token` (short-lived, e.g., 1 hour)
  - `refresh_token` (long-lived, e.g., 30 days)
- Tokens are stored as HTTP-only cookies
- User is automatically redirected to `/profile` page

### 2. **Protected Route Access (`/profile`)**
- Middleware checks for authentication tokens
- **If both tokens are missing**: Redirect to `/login`
- **If only access token is missing**: Attempt to refresh tokens using refresh token
  - If refresh succeeds: Continue to profile page with new tokens
  - If refresh fails: Redirect to `/login`
- **If both tokens are valid**: Allow access to profile page

### 3. **Auth Route Protection (`/login`, `/signup`)**
- Middleware checks if user is already authenticated
- **If user has valid tokens**: Automatically redirect to `/profile`
- **If user has no tokens**: Allow access to login/signup pages
- This prevents authenticated users from accessing login/signup pages

### 4. **Token Expiration**
- **Access token expires**: Automatically refreshed by middleware using refresh token
- **Refresh token expires**: User must log in again
- User is redirected to `/login` when all tokens expire

### 5. **Logout Flow**
- User clicks logout button on profile page
- Both `access_token` and `refresh_token` cookies are deleted
- User is redirected to `/login` page

## Route Protection Summary

| Route | Authenticated User | Unauthenticated User |
|-------|-------------------|---------------------|
| `/login` | Redirected to `/profile` | Allowed |
| `/signup` | Redirected to `/profile` | Allowed |
| `/profile` | Allowed | Redirected to `/login` |

## Middleware Configuration

The middleware protects these routes:
- `/profile` - Protected route requiring authentication
- `/login` - Auth route that redirects authenticated users
- `/signup` - Auth route that redirects authenticated users

## User Experience

### Scenario 1: User tries to access `/login` while logged in
1. User has valid tokens
2. Middleware detects authentication
3. User is automatically redirected to `/profile`

### Scenario 2: User's access token expires while browsing
1. Access token expires
2. User navigates to `/profile`
3. Middleware detects missing access token but valid refresh token
4. Middleware automatically refreshes tokens in background
5. User continues to `/profile` seamlessly

### Scenario 3: User's refresh token expires
1. Both tokens expire
2. User tries to access `/profile`
3. Middleware detects no valid tokens
4. User is redirected to `/login`
5. User must log in again

### Scenario 4: User manually logs out
1. User clicks logout button
2. All cookies are cleared
3. User is redirected to `/login`
4. User cannot access `/profile` until logging in again

## Security Features

1. **HTTP-only cookies**: Tokens cannot be accessed by JavaScript
2. **Automatic token refresh**: Seamless user experience
3. **Route protection**: Middleware enforces authentication rules
4. **Secure cookie settings**: 
   - `httpOnly: true`
   - `sameSite: 'lax'`
   - `secure: true` (in production)
   - `path: '/'`

## Implementation Files

- `middleware.ts` - Route protection and token refresh logic
- `app/actions/form-actions.tsx` - Login, signup, and logout actions
- `app/lib/validateAuth.ts` - Token validation utility
- `app/(auth)/login/page.tsx` - Login page
- `app/(auth)/signup/page.tsx` - Signup page
- `app/profile/page.tsx` - Protected profile page
