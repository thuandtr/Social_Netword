// Import axios HTTP client library for making API requests
import axios from "axios";
// Import Next.js cookies utility for server-side cookie access
import { cookies } from 'next/headers'
import { redirect } from "next/navigation";

// Export an async function to validate user authentication tokens
export const validateAuth = async () => {
    console.log("Validating authentication...");

    // Get the cookie store instance from Next.js headers (server-side only)
    const cookieStore = await cookies();

    try {
        // In Docker, use backend service name; outside Docker, use localhost
        const backendURL = process.env.LOCAL_BACKEND_URL || process.env.PROD_BACKEND_URL || "http://backend:5000/api/v1/auth";
        const URL = backendURL + '/validate/tokens';

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

        // If access token is missing but refresh token exists, let backend handle refresh
        // if (!accessToken) {
        //     console.log("Missing access token but refresh token exists - attempting refresh");
        // }

        // Make a PUT request to the backend validation endpoint
        const res = await axios.put(URL, {}, {
            withCredentials: true,
            headers: {
                // Send both access and refresh tokens in Authorization header
                // Use empty string for access token if missing, backend will handle refresh
                Authorization: `access_token=${accessToken || ''}, refresh_token=${refreshToken}`,
            }
        });

        const data = await res.data;

        if (data.message === "Tokens refreshed successfully") {
            console.log("Tokens were refreshed successfully.");
            console.log("✅ NEW ACCESS TOKEN:", data.tokens?.accessToken);
            console.log("✅ NEW REFRESH TOKEN:", data.tokens?.refreshToken);
            console.log("✅ TOKEN EXPIRES IN:", data.tokens?.expiresIn);

            // Check if cookies were set in the response headers
            const setCookieHeader = res.headers['set-cookie'];
            if (setCookieHeader) {
                console.log("Set-Cookie headers received:", setCookieHeader);
                
                const newAccessToken = setCookieHeader.find(cookie =>
                    cookie.startsWith('access_token=')
                )?.split('=')[1]?.split(';')[0];

                const newRefreshToken = setCookieHeader.find(cookie => 
                    cookie.startsWith('refresh_token=')
                )?.split('=')[1]?.split(';')[0];

                if(newAccessToken && newRefreshToken) {
                    console.log("✅ New tokens received in cookies for future requests.");
                } else {
                    console.log("⚠️ New tokens were generated but not found in Set-Cookie headers");
                }
            } else {
                console.log("⚠️ No Set-Cookie headers found in response");
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
