// Import axios HTTP client library for making API requests
import axios from "axios";
// Import Next.js cookies utility for server-side cookie access
import { cookies } from 'next/headers'

// Export an async function to validate user authentication tokens
export const validateAuth = async () => {
    console.log("Validating authentication...");

    // Get the cookie store instance from Next.js headers (server-side only)
    const cookieStore = await cookies();

    try {
        const URL = process.env.LOCAL_BACKEND_URL + '/user/validate-tokens' || "http://localhost:5000/api/v1/auth/user/validate/tokens";

        // Make a PUT request to the backend validation endpoint
        const res = await axios.put(URL, {}, {
            withCredentials: true,
            headers: {
                // Send both access and refresh tokens in Authorization header
                // Extract token values from cookies, using optional chaining to avoid errors if cookies don't exist
                Authorization: `access_token=${cookieStore.get('access_token')?.value}, refresh_token=${cookieStore.get('refresh_token')?.value}`,
            }
        });

        const data = await res.data;
        console.log("Validation response data:", data);

        return data;
    } catch (error) {
        console.error("Error validating authentication:", error);
        throw error;
    }
}