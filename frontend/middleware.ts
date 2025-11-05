import { MiddlewareConfig, NextRequest, NextResponse } from "next/server";


export const middleware = async (req: NextRequest) => {
    const pathname = req.nextUrl.pathname;

    // Read cookies from the incoming request (middleware cannot use next/headers.cookies())
    const accessToken = req.cookies.get('access_token')?.value;
    const refreshToken = req.cookies.get('refresh_token')?.value;

    // Route classification
    const isAuthRoute = pathname === '/login' || pathname === '/signup';
    const isProtectedRoute = pathname.startsWith('/profile') || pathname.startsWith('/update');

    // If already authenticated, prevent accessing auth pages
    if (isAuthRoute && !!refreshToken) {
        const url = req.nextUrl.clone();
        url.pathname = '/profile';
        return NextResponse.redirect(url);
    }

    // Guard protected routes: require refresh_token (access can be refreshed server-side)
    if (isProtectedRoute && !refreshToken) {
        const url = req.nextUrl.clone();
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }

    // Otherwise continue
    return NextResponse.next();
}

export const config: MiddlewareConfig = {
    // Evaluate only relevant routes for auth logic
    matcher: [
        "/login",
        "/signup",
        "/profile",
        "/profile/:path*",
        "/update",
        "/update/:path*",
    ],
};