import { Request, Response } from "express";
import { validateAccessToken, validateRefreshToken } from "../utils/helpers";
import { decode } from "jsonwebtoken";
import { generateJWTToken, saveRefreshToken } from "../token/jwt-token-manager";
import { encryptData } from "../encryption";
import { setCookies } from "../handlers/user-handler";

export const validateAuthMiddleware = async ( req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: "Authorization header is required" });
    }

    const tokens = authHeader.split(",");
    if (tokens.length !== 2) {
        return res.status(401).json({ error: "Invalid authorization header format" });
    }

    const [access, refresh] = tokens;
    const accessToken = access && access.split("=")[1];
    const refreshToken = refresh.split("=")[1];

    const isAccessTokenValid = await validateAccessToken(accessToken);
    const decodeRefreshToken = await validateRefreshToken(refreshToken);

    if (isAccessTokenValid && decodeRefreshToken) {
        console.log("Both tokens are valid");
        return res.status(200).json({ success: true, message: "Tokens are valid" });
    } else if (!isAccessTokenValid && decodeRefreshToken) {
        // regenerate access token logic can be added here
        const newAccessToken = generateJWTToken(decodeRefreshToken!.id!, decodeRefreshToken.email!, "access");

        const newRefreshToken = generateJWTToken(decodeRefreshToken!.id!, decodeRefreshToken.email!, "refresh");
        
        const newEncryptedRefreshToken = encryptData(newRefreshToken);
        await saveRefreshToken(newRefreshToken, newEncryptedRefreshToken);

        setCookies(newAccessToken, newEncryptedRefreshToken, res);
        return res.status(200).json({ success: true, message: "Authorized" });
    } else {
        return res.status(401).json({ success: false, message: "Not Authorized" });
    }
};
