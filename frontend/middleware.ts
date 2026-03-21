import { MiddlewareConfig, NextRequest, NextResponse } from "next/server";

/**
 * Decode a JWT payload (without verification) to check the exp claim.
 * Returns true if the token exists and expires more than 60 seconds from now.
 */
function isAccessTokenValid(token: string | undefined): boolean {
    if (!token) return false;
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return false;
        // base64url → base64 → decode
        const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
        return !!payload.exp && (payload.exp * 1000) > (Date.now() + 60_000);
    } catch {
        return false;
    }
}

/**
 * Call the backend token-validation endpoint.
 * Returns new token values when a refresh occurred, or null otherwise.
 */
async function refreshTokens(
    accessToken: string | undefined,
    refreshToken: string,
): Promise<{ accessToken: string; refreshToken: string } | null> {
    try {
        const backendUrl =
            process.env.PROD_BACKEND_URL ||
            process.env.LOCAL_BACKEND_URL ||
            "http://localhost:5000/api/v1/auth";

        const res = await fetch(`${backendUrl}/validate/tokens`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `access_token=${accessToken || ''}, refresh_token=${refreshToken}`,
            },
            body: JSON.stringify({}),
        });

        if (res.ok) {
            const data = await res.json();
            if (data.message === "Tokens refreshed successfully" && data.tokens) {
                return {
                    accessToken: data.tokens.accessToken,
                    refreshToken: data.tokens.refreshToken,
                };
            }
        }
    } catch (error) {
        console.error("[Middleware] Token refresh error:", error);
    }
    return null;
}

export const middleware = async (req: NextRequest) => {
    const pathname = req.nextUrl.pathname;

    // Read cookies from the incoming request
    const refreshToken = req.cookies.get('refresh_token')?.value;
    const accessToken = req.cookies.get('access_token')?.value;
    const isLoggedIn = !!refreshToken;

    // Route classification
    const isAdminLoginRoute = pathname === '/admin/login';
    const isAdminRoute = pathname.startsWith('/admin') && !isAdminLoginRoute;
    const isAuthRoute = pathname === '/login' || pathname === '/signup';

    // Admin login: always allow through (role check happens server-side)
    if (isAdminLoginRoute) {
        return NextResponse.next();
    }

    // Admin protected routes: require login
    if (isAdminRoute) {
        if (!isLoggedIn) {
            const url = req.nextUrl.clone();
            url.pathname = '/admin/login';
            return NextResponse.redirect(url);
        }
        // Fall through to token refresh below
    }

    // Regular auth routes: redirect to home if already logged in
    if (isAuthRoute) {
        if (isLoggedIn) {
            const url = req.nextUrl.clone();
            url.pathname = '/';
            return NextResponse.redirect(url);
        }
        return NextResponse.next();
    }

    // Automatic token refresh: if logged in but access token is missing or about to expire,
    // proactively refresh so downstream server components receive valid cookies.
    if (isLoggedIn && !isAccessTokenValid(accessToken)) {
        const newTokens = await refreshTokens(accessToken, refreshToken!);

        if (newTokens) {
            const response = NextResponse.next();
            const isProduction = process.env.NODE_ENV === 'production';

            response.cookies.set('access_token', newTokens.accessToken, {
                httpOnly: true,
                path: '/',
                sameSite: 'lax',
                secure: isProduction,
                maxAge: 3600, // 1 hour
            });

            response.cookies.set('refresh_token', newTokens.refreshToken, {
                httpOnly: true,
                path: '/',
                sameSite: 'lax',
                secure: isProduction,
                maxAge: 30 * 24 * 3600, // 30 days
            });

            return response;
        }
    }

    // All non-admin routes are public.
    return NextResponse.next();
}

export const config: MiddlewareConfig = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
    ],
};
