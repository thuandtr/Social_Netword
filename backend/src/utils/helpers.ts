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
        const decryptedData = await verifyAndDecode(token);
        if (decryptedData) {
            return true;
        } else {
            return false;
        }

    } catch (error) {
        console.error("Error validating access token:", error);
        throw error;
    }
}

const validateRefreshToken = async (encryptedToken: string) => {
    try {
        const jwtToken = decryptData(encryptedToken);
        const decodedJWTData = await verifyAndDecode(jwtToken) as TokenInfo | null;

        if (!decodedJWTData) {
            console.log("Invalid refresh token");
            return false;
        }

        const encryptedTokenFromCache = await getCache(generateRedisKey(decodedJWTData.id));

        if (!encryptedTokenFromCache) {
            console.log("No refresh token found in cache");
            return false;
        }

        const decryptedTokenFromData = decryptData(encryptedTokenFromCache);
        const decodedJWTDataFromCache = await verifyAndDecode(decryptedTokenFromData) as TokenInfo | null;

        if (encryptedTokenFromCache !== encryptedToken && decryptedTokenFromData !== jwtToken) {
            console.log("Refresh token mismatch");
            return false;
        }

        const ttl = generateTTL(decodedJWTDataFromCache!.exp);

        if (ttl <= 0) {
            console.log("Refresh token expired");
            return false;
        };

        return { ...decodedJWTDataFromCache, ttl };
    } catch (error) {
        console.error("Error validating refresh token:", error);
        throw error;
    }
}

export { generateTTL, generateRedisKey, validateAccessToken, validateRefreshToken };