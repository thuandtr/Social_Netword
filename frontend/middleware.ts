import { MiddlewareConfig, NextRequest, NextResponse } from "next/server";


export const middleware = async (req: NextRequest) => {
    const pathname = req.nextUrl.pathname;

    // Read cookies from the incoming request
    const refreshToken = req.cookies.get('refresh_token')?.value;
    const isLoggedIn = !!refreshToken;

    // Route classification
    const isPublicRoute = pathname === '/' || pathname.startsWith('/articles');
    const isAdminLoginRoute = pathname === '/admin/login';
    const isAdminRoute = pathname.startsWith('/admin') && !isAdminLoginRoute;
    const isAuthRoute = pathname === '/login' || pathname === '/signup';

    // Public routes: always accessible
    if (isPublicRoute) {
        return NextResponse.next();
    }

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
        return NextResponse.next();
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

    // All other routes (newsfeed, profile, etc.) require login
    if (!isLoggedIn) {
        const url = req.nextUrl.clone();
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config: MiddlewareConfig = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
    ],
};
