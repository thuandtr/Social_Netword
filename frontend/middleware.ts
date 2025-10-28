import { MiddlewareConfig, NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { validateAuth } from "./app/lib/validateAuth";


export const middleware = async (req: NextRequest) => {
    const cookieStore = await cookies();
    const pathname = req.nextUrl.pathname;

    const accessToken = cookieStore.get('access_token');
    const refreshToken = cookieStore.get('refresh_token');

    // Check if user is on auth routes (login/signup)
    const isAuthRoute = pathname === '/login' || pathname === '/signup';
    
    // If user has tokens and tries to access login/signup, redirect to profile
    if (isAuthRoute && (accessToken || refreshToken)) {
        console.log("User is authenticated, redirecting from auth route to profile");
        const url = req.nextUrl.clone();
        url.pathname = '/profile';
        return NextResponse.redirect(url);
    }

    // If user is on protected route (profile), check authentication
    if (!isAuthRoute) {
        // Only redirect if both tokens are missing
        if (!accessToken && !refreshToken) {
            const url = req.nextUrl.clone();
            console.log("No tokens found - redirecting to login:", url.pathname); 
            url.pathname = '/login';
            return NextResponse.redirect(url);
        }
        
        // If we have tokens, allow access to the protected route
        // The profile page itself will handle token validation and data fetching
        console.log("User has tokens, allowing access to:", pathname);
        return NextResponse.next();
    }

    // Allow access to auth routes when not authenticated
    return NextResponse.next();
}

export const config: MiddlewareConfig = {
    // Protect profile route and auth routes (login/signup)
    matcher: ["/profile", "/login", "/signup"],
};