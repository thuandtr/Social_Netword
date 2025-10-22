import jwt from "jsonwebtoken";
import { generateRedisKey, generateTTL } from "../utils/helpers";
import { encryptData } from "../encryption";
import { setCache } from "../redis/actions";
import { TOKEN_CONFIG } from "../config/token-config";

/*
An accessToken is a short-lived access token that is issued to a user after a successful login. 
This token is sent with each request (usually via the Authorization: Bearer <token> header) 
to prove that the user has been authenticated and is allowed to access the resource.

refreshToken is a session refresh token, used to request a new accessToken when the old 
accessToken expires — without requiring the user to log in again.

*/

/**
 * Creates a JWT token with user data
 * - Access tokens expire in 1 hour (for API requests)
 * - Refresh tokens expire in 30 days (to get new access tokens)
 * - Signs token with JWT_SECRET for security
 * - Uses centralized TOKEN_CONFIG for consistent lifetimes
 */
const generateJWTToken = (id: string, email: string, tokenType: "access" | "refresh") => {
    const token = jwt.sign(
        {
            id,
            email,
        },
        process.env.JWT_SECRET as string,
        {
            expiresIn: tokenType === "access" 
                ? TOKEN_CONFIG.ACCESS_TOKEN_EXPIRES_IN 
                : TOKEN_CONFIG.REFRESH_TOKEN_EXPIRES_IN
        });

    return token;
}

export const verifyAndDecode = (token: string) => {
    return new Promise((res, rej) => {
        jwt.verify(token, process.env.JWT_SECRET as string, (err, payload) => {
            if (err) {
                console.log("JWT verification error:", err);
                rej(err);
            } else {
                console.log("JWT payload:", payload);
                res(payload);
            }
        });
    });
}

/**
 * Saves refresh token to Redis with encryption
 * - Decodes token to get user ID and expiration time
 * - Creates Redis key based on user ID
 * - Encrypts token before storing in Redis
 * - Sets automatic expiration based on token's exp time
 */
const saveRefreshToken = async (token: string, encryptedToken: string) => {
    try {
        // Decode the JWT token without verification to extract the payload data
        // { json: true } returns parsed object instead of string
        const decodedData = jwt.decode(token, { json: true });
        /*
        decodedData = {
            id: "123",
            email: "user@example.com", 
            iat: 1698768000,  // issued at timestamp
            exp: 1699372800   // expiration timestamp (7 days later)
        }
        */
        // Check if token decoding was successful, throw error if token is malformed
        if (!decodedData) throw new Error("Invalid token");

        // Generate a Redis key using the user ID from the decoded token payload
        // This creates a unique key like "refresh_token:user_123" for storage
        const key = generateRedisKey(decodedData.id);

        // Calculate Time To Live (TTL) in seconds based on token's expiration timestamp
        // Uses the 'exp' claim from JWT payload (! asserts it exists)
        const TTL = generateTTL(decodedData.exp!);
        // Store the token in Redis: encrypt it first, then save with auto-expiration
        // setCache(key, value, ttl) - stores encrypted token that expires automatically
        console.log("=== SAVING REFRESH TOKEN ===");
        console.log("Redis Key:", key);
        console.log("Encrypted Token to Save:", encryptedToken);
        console.log("TTL (seconds):", TTL);
        
        await setCache(key, encryptedToken, TTL);

        // Log success message for debugging/monitoring purposes
        console.log("✅ Refresh token saved in Redis successfully");
    } catch (error) {
        // Log any errors that occur during Redis storage operation
        console.error("Error saving refresh token:", error);

        // Re-throw the error so calling function can handle it appropriately
        throw error;
    }
}


export { generateJWTToken, saveRefreshToken };