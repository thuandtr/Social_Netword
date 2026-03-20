import { verify } from "jsonwebtoken";
import { token } from "morgan";
import { verifyAndDecode } from "../token/jwt-token-manager";
import { decryptData } from "../encryption";
import { getCache } from "../redis/actions";

type TokenInfo = {
    id: string;
    email: string;
    iat: number;
    exp: number;
}

const generateTTL = (tokenExpire: number) => {
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

    const secondsToExpire = tokenExpire - currentTime;

    return secondsToExpire > 0 ? secondsToExpire : 0;
}

const generateRedisKey = (userId: string): string => {
    return `user-${userId}`;
}

const validateAccessToken = async (token: string) => {
    try {
        // Return false if token is undefined, null, or empty
        if (!token || token.trim() === '') {
            console.log("Access token is empty or undefined");
            return false;
        }

        const decryptedData = await verifyAndDecode(token);
        if (decryptedData) {
            return true;
        } else {
            return false;
        }

    } catch (error) {
        console.error("Error validating access token:", error);
        return false;
    }
}

const validateRefreshToken = async (encryptedToken: string) => {
    try {
        const startedAt = Date.now();

        // Decrypt the token first
        const jwtToken = decryptData(encryptedToken);

        // Verify and decode the JWT
        const decodedJWTData = await verifyAndDecode(jwtToken) as TokenInfo | null;

        if (!decodedJWTData) {
            return false;
        }

        // Check if token is expired
        const currentTime = Math.floor(Date.now() / 1000);
        if (decodedJWTData.exp <= currentTime) {
            return false;
        }

        const redisKey = generateRedisKey(decodedJWTData.id);
        const encryptedTokenFromCache = await getCache(redisKey);

        if (!encryptedTokenFromCache) {
            // Fail fast on missing cache entry to avoid request-time recovery latency.
            // Client can re-authenticate and re-seed cache on login.
            return false;
        }

        // Fast path for the common case: exact encrypted token match.
        if (encryptedTokenFromCache === encryptedToken) {
            const ttl = generateTTL(decodedJWTData.exp);
            if (ttl <= 0) {
                return false;
            }
            return { ...decodedJWTData, ttl };
        }

        // Compare the tokens
        const decryptedTokenFromCache = decryptData(encryptedTokenFromCache);
        const decodedJWTDataFromCache = await verifyAndDecode(decryptedTokenFromCache) as TokenInfo | null;

        if (!decodedJWTDataFromCache) {
            return false;
        }

        // Instead of comparing raw tokens, compare the user data and use the cached token
        // This handles the case where tokens were issued at different times
        if (decodedJWTData.id !== decodedJWTDataFromCache.id || 
            decodedJWTData.email !== decodedJWTDataFromCache.email) {
            return false;
        }

        const ttl = generateTTL(decodedJWTDataFromCache.exp);

        if (ttl <= 0) {
            return false;
        }

        const elapsed = Date.now() - startedAt;
        if (elapsed > 300) {
            console.warn(`Slow refresh token validation: ${elapsed}ms`);
        }

        return { ...decodedJWTDataFromCache, ttl };
    } catch (error) {
        console.error("Error validating refresh token:", error);
        throw error;
    }
}

export { generateTTL, generateRedisKey, validateAccessToken, validateRefreshToken };