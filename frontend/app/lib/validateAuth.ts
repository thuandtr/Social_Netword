// Import axios HTTP client library for making API requests
import axios from "./axios";
// Import Next.js cookies utility for server-side cookie access
import { cookies } from 'next/headers'
import { redirect } from "next/navigation";
import setCookieParse from 'set-cookie-parser';

// Export an async function to validate user authentication tokens
export const validateAuth = async () => {
    console.log("Validating authentication...");

    // Get the cookie store instance from Next.js headers (server-side only)
    const cookieStore = await cookies();

    try {
        // Get token values, return null if they don't exist
        const accessToken = cookieStore.get('access_token')?.value;
        const refreshToken = cookieStore.get('refresh_token')?.value;

        console.log("Access Token:", accessToken);
        console.log("Refresh Token:", refreshToken);

        // If refresh token is missing, we can't authenticate at all
        if (!refreshToken) {
            console.log("Missing refresh token - cannot authenticate");
            return { success: false, message: "Missing authentication tokens" };
        }

        // Make a PUT request to the backend validation endpoint
        const res = await axios.put('/validate/tokens', {}, {
            headers: {
                // Send both access and refresh tokens in Authorization header
                Authorization: `access_token=${accessToken || ''}, refresh_token=${refreshToken}`,
            }
        });

        const data = await res.data;

        if (data.message === "Tokens refreshed successfully") {
            console.log("Tokens were refreshed successfully.");

            // Parse Set-Cookie headers properly using set-cookie-parser
            // (avoids split('=')[1] which truncates base64 tokens with '=' padding)
            const setCookieHeader = res.headers['set-cookie'];
            if (setCookieHeader) {
                const parsedCookies = setCookieParse(setCookieHeader);
                for (const cookie of parsedCookies) {
                    if (!cookie.value) continue;
                    try {
                        cookieStore.set(cookie.name, cookie.value, {
                            path: '/',
                            httpOnly: true,
                            sameSite: 'lax',
                            secure: process.env.NODE_ENV === 'production',
                            maxAge: cookie.name === 'access_token' ? 3600 : 30 * 24 * 3600,
                        });
                        console.log(`✅ Updated cookie: ${cookie.name}`);
                    } catch (e) {
                        // cookies().set() only works in Server Actions / Route Handlers.
                        // In Server Components the middleware handles refresh instead.
                        console.warn("Could not update cookie (expected in Server Components):", cookie.name);
                    }
                }
            }
        }
        console.log("Validation response data:", data);

        return data;
    } catch (error) {
        console.error("Error validating authentication:", error);
        throw error;
    }
}

export const getAuthHeaders = async () => {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('access_token')?.value || ''
  const refreshToken = cookieStore.get('refresh_token')?.value || ''
  return {
    Authorization: `access_token=${accessToken}, refresh_token=${refreshToken}`,
  }
}

// Lightweight check for presence of refresh token
export const isAuthenticated = async () => {
  const cookieStore = await cookies()
  return Boolean(cookieStore.get('refresh_token')?.value)
}

// Server-side guard usable in server components/actions
export const requireAuth = async (redirectTo: string = '/login') => {
  const authed = await isAuthenticated()
  if (!authed) redirect(redirectTo)
}
