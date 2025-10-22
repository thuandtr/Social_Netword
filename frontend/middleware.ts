import { MiddlewareConfig, NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { validateAuth } from "./app/lib/validateAuth";


export const middleware = async (req: NextRequest) => {
    const cookieStore = await cookies();

    const accessToken = cookieStore.get('access_token');
    const refreshToken = cookieStore.get('refresh_token');

    // Only redirect if both tokens are missing
    if (!accessToken && !refreshToken) {
        const url = req.nextUrl.clone();
        console.log("No tokens found - redirecting to login:", url.pathname); 
        url.pathname = '/login';
        return NextResponse.rewrite(url);
    } else if (!accessToken && refreshToken) {
        console.log("Access token missing but refresh token exists - attempting token refresh");
        
        try {
            // Call backend to refresh tokens
            const URL = process.env.LOCAL_BACKEND_URL + '/validate/tokens' || "http://localhost:5000/api/v1/auth/validate/tokens";
            
            console.log("=== FRONTEND TOKEN REFRESH REQUEST ===");
            console.log("URL:", URL);
            console.log("Refresh Token Value:", refreshToken.value);
            console.log("Authorization Header:", `access_token=, refresh_token=${refreshToken.value}`);
            
            const response = await fetch(URL, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Authorization': `access_token=, refresh_token=${refreshToken.value}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log("Token refresh response status:", response.status);

            if (response.ok) {
                const data = await response.json();
                console.log("Token refresh response:", data);
                
                if (data.message === "Tokens refreshed successfully") {
                    console.log("Tokens refreshed successfully, handling new cookies");
                    
                    // Create a new response to continue with the request
                    const nextResponse = NextResponse.next();
                    
                    // Manually set cookies from the response data (more reliable than parsing headers)
                    // Note: Removed explicit maxAge/expires since backend already sets proper cookie lifetime
                    if (data.tokens?.accessToken) {
                        console.log("Setting new access token in response cookies");
                        nextResponse.cookies.set('access_token', data.tokens.accessToken, {
                            httpOnly: true,
                            secure: process.env.NODE_ENV === 'production',
                            sameSite: 'lax',
                            path: '/'
                            // maxAge removed - let backend-set cookie lifetime take precedence
                        });
                    }
                    
                    if (data.tokens?.refreshToken) {
                        console.log("Setting new refresh token in response cookies");
                        nextResponse.cookies.set('refresh_token', data.tokens.refreshToken, {
                            httpOnly: true,
                            secure: process.env.NODE_ENV === 'production',
                            sameSite: 'lax',
                            path: '/'
                            // maxAge removed - let backend-set cookie lifetime take precedence
                        });
                    }
                    
                    console.log("✅ New tokens set in middleware response cookies");
                    return nextResponse;
                } else if (data.message === "Access token and refresh token are valid") {
                    console.log("Tokens are valid, continuing with request");
                } else {
                    console.log("Token refresh failed, redirecting to login");
                    const url = req.nextUrl.clone();
                    url.pathname = '/login';
                    return NextResponse.rewrite(url);
                }
            } else {
                console.log("Token refresh request failed, redirecting to login");
                const url = req.nextUrl.clone();
                url.pathname = '/login';
                return NextResponse.rewrite(url);
            }
        } catch (error) {
            console.error("Error during token refresh:", error);
            const url = req.nextUrl.clone();
            url.pathname = '/login';
            return NextResponse.rewrite(url);
        }
    }

    try {
        const authData = await validateAuth();
        console.log("Middleware auth data:", authData);
        if (!authData || !authData.success) {
            const url = req.nextUrl.clone(); 
            url.pathname = '/login';

            return NextResponse.rewrite(url);
        }
        
        // Authentication successful, continue with the request
        return NextResponse.next();
    } catch (error) {
        console.error("Auth validation error:", error);
        const url = req.nextUrl.clone(); 
        url.pathname = '/login';

        return NextResponse.rewrite(url);
    }

}

export const config: MiddlewareConfig = {
    // matcher: "/profile/:path",
    matcher: "/profile",
};