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
        const jwtToken = decryptData(encryptedToken);
        console.log("jwtTokenAAA:", jwtToken);
        const decodedJWTData = await verifyAndDecode(jwtToken) as TokenInfo | null;
        console.log("decodedJWTDataAAA:", decodedJWTData);

        if (!decodedJWTData) {
            console.log("Invalid refresh token");
            return false;
        }

        const encryptedTokenFromCache = await getCache(generateRedisKey(decodedJWTData.id));

        console.log("=== REFRESH TOKEN COMPARISON ===");
        console.log("Encrypted token from CLIENT:", encryptedToken);
        console.log("Encrypted token from CACHE:", encryptedTokenFromCache);
        console.log("Client token length:", encryptedToken ? encryptedToken.length : 0);
        console.log("Cache token length:", encryptedTokenFromCache ? encryptedTokenFromCache.length : 0);

        if (!encryptedTokenFromCache) {
            console.log("No refresh token found in cache");
            return false;
        }

        const decryptedTokenFromCache = decryptData(encryptedTokenFromCache);
        console.log("Decrypted token from CLIENT:", jwtToken);
        console.log("Decrypted token from CACHE:", decryptedTokenFromCache);

        const decodedJWTDataFromCache = await verifyAndDecode(decryptedTokenFromCache) as TokenInfo | null;
        console.log("Decoded JWT from cache:", decodedJWTDataFromCache);

        if (!decodedJWTDataFromCache) {
            console.log("❌ CACHED TOKEN IS INVALID");
            return false;
        }

        // Instead of comparing raw tokens, compare the user data and use the cached token
        // This handles the case where tokens were issued at different times
        if (decodedJWTData.id !== decodedJWTDataFromCache.id || 
            decodedJWTData.email !== decodedJWTDataFromCache.email) {
            console.log("❌ USER IDENTITY MISMATCH:");
            console.log("  - Client user ID:", decodedJWTData.id);
            console.log("  - Cache user ID:", decodedJWTDataFromCache.id);
            console.log("  - Client email:", decodedJWTData.email);
            console.log("  - Cache email:", decodedJWTDataFromCache.email);
            return false;
        }

        // Check if the cached token is more recent than the client token
        if (decodedJWTDataFromCache.iat > decodedJWTData.iat) {
            console.log("⚠️  CLIENT TOKEN IS OUTDATED:");
            console.log("  - Client token issued at:", new Date(decodedJWTData.iat * 1000).toISOString());
            console.log("  - Cache token issued at:", new Date(decodedJWTDataFromCache.iat * 1000).toISOString());
            console.log("  - Using cached token as it's more recent");
        }

        console.log("✅ REFRESH TOKEN VALIDATION PASSED");

        const ttl = generateTTL(decodedJWTDataFromCache.exp);
        console.log("Refresh token TTL:", ttl);

        if (ttl <= 0) {
            console.log("Refresh token expired");
            return false;
        }

        return { ...decodedJWTDataFromCache, ttl };
    } catch (error) {
        console.error("Error validating refresh token:", error);
        throw error;
    }
}

export { generateTTL, generateRedisKey, validateAccessToken, validateRefreshToken };