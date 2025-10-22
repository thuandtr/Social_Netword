# Token Lifetime Optimization

## Overview
This document explains the token lifetime optimization implemented to address inconsistencies and redundancy between frontend and backend token management.

## Issues Fixed

### 1. Inconsistent Refresh Token Lifetimes
**Before:**
- JWT expiration: 7 days
- Backend cookie: 30 days  
- Frontend middleware: 30 days

**After:**
- JWT expiration: 30 days (consistent)
- Backend cookie: 30 days
- Frontend middleware: No manual setting (defers to backend)

### 2. Redundant Frontend Cookie Settings
**Before:**
Frontend middleware was manually setting `maxAge` for cookies, creating potential conflicts with backend-set cookie lifetimes.

**After:**
Frontend middleware now relies on backend-set cookie lifetimes, eliminating redundancy and potential conflicts.

### 3. Hardcoded Values Scattered Across Files
**Before:**
Token lifetimes were hardcoded in multiple places, making maintenance difficult.

**After:**
Centralized configuration in `backend/src/config/token-config.ts` provides single source of truth.

## Implementation Details

### Centralized Configuration
```typescript
// backend/src/config/token-config.ts
export const TOKEN_CONFIG = {
    ACCESS_TOKEN_EXPIRES_IN: "1h",
    REFRESH_TOKEN_EXPIRES_IN: "30d",
    ACCESS_TOKEN_COOKIE_MAX_AGE: 60 * 60 * 1000, // 1 hour in ms
    REFRESH_TOKEN_COOKIE_MAX_AGE: 30 * 24 * 60 * 60 * 1000, // 30 days in ms
    COOKIE_SETTINGS: {
        httpOnly: true,
        path: "/",
        sameSite: 'lax' as const,
        secure: process.env.NODE_ENV === 'production'
    }
};
```

### Frontend Middleware Changes
- Removed explicit `maxAge` settings
- Let backend control cookie lifetimes
- Maintains security settings (httpOnly, secure, sameSite)

### Backend Changes
- Updated JWT refresh token expiration from 7d to 30d
- Refactored cookie setting to use centralized config
- Improved maintainability and consistency

## Benefits

1. **Consistency**: All token lifetimes are now aligned
2. **Single Source of Truth**: Backend controls all timing
3. **Easier Maintenance**: Change lifetimes in one place
4. **Reduced Conflicts**: No frontend/backend timing mismatches
5. **Better Security**: Consistent expiration enforcement

## Security Considerations

- JWT expiration times match cookie expiration times
- Redis TTL automatically handles token cleanup
- HttpOnly cookies prevent JavaScript access
- Secure flag enabled in production
- SameSite protection against CSRF

## Future Recommendations

1. Consider environment-specific token lifetimes (dev vs prod)
2. Implement token refresh rotation for enhanced security
3. Add monitoring for token usage patterns
4. Consider shorter access token lifetimes (15-30 minutes) for better security