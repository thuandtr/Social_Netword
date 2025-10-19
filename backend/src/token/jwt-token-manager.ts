import jwt from "jsonwebtoken";
import { generateRedisKey, generateTTL } from "../utils/helpers";
import { encryptData } from "../encryption";
import { setCache } from "../redis/actions";

/*
An accessToken is a short-lived access token that is issued to a user after a successful login. 
This token is sent with each request (usually via the Authorization: Bearer <token> header) 
to prove that the user has been authenticated and is allowed to access the resource.

refreshToken is a session refresh token, used to request a new accessToken when the old 
accessToken expires — without requiring the user to log in again.

*/
const generateJWTToken = (id: string, email: string, tokenType: "access" | "refresh") => {
    const token = jwt.sign(
    {
        id,
        email,
    },
    process.env.JWT_SECRET as string,
    {
        expiresIn: tokenType === "access" ? "1h" : "7d"
    });

    return token;
}

const saveRefreshToken = async (token: string) => {
    const decodedData = jwt.decode(token, { json: true});
    if (!decodedData) throw new Error("Invalid token");

    const key = generateRedisKey(decodedData.id);
    const TTL = generateTTL(decodedData.exp!);

    try {
        await setCache(key, encryptData(token), TTL);
        console.log("Refresh token saved in Redis");
    } catch (error) {
        console.error("Error saving refresh token:", error);
        throw error;
    }
}


export { generateJWTToken, saveRefreshToken };