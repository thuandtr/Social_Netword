import { Request, Response } from "express";
import { validateAccessToken, validateRefreshToken } from "../utils/helpers";
import { decode } from "jsonwebtoken";
import { generateJWTToken, saveRefreshToken } from "../token/jwt-token-manager";
import { encryptData } from "../encryption";
import { setCookies } from "../handlers/user-handler";

export const validateAuthMiddleware = async ( req: Request, res: Response) => {
    const authHeader = req.headers.authorization;

    console.log("Authorization Header:", authHeader);
    if (!authHeader) {
        return res.status(401).json({ error: "Authorization header is required" });
    }

    const tokens = authHeader.split(", ");
    if (tokens.length !== 2) {
        return res.status(401).json({ error: "Invalid authorization header format" });
    }

    const [access, refresh] = tokens;
    const accessToken = access && access.split("=")[1];
    const refreshToken = refresh.split("=")[1];

    console.log("=== TOKEN DEBUGGING ===");
    console.log("Access Token from client:", accessToken);
    console.log("Refresh Token from client:", refreshToken);
    console.log("Access Token length:", accessToken ? accessToken.length : 0);
    console.log("Refresh Token length:", refreshToken ? refreshToken.length : 0);

    // Handle empty access token (but don't validate if it's empty or undefined)
    const isAccessTokenValid = accessToken && accessToken.trim() !== '' ? await validateAccessToken(accessToken) : false;
    const decodeRefreshToken = await validateRefreshToken(refreshToken);

    console.log("Access Token Valid:", isAccessTokenValid);
    console.log("Decoded Refresh Token:", decodeRefreshToken);

    if (isAccessTokenValid && decodeRefreshToken) {
        console.log("Both tokens are valid");
        return res.status(200).json({ success: true, message: "Access token and refresh token are valid" });
    } else if (!isAccessTokenValid && decodeRefreshToken) {
        // Access token is invalid/missing but refresh token is valid - regenerate tokens
        console.log("=== GENERATING NEW TOKENS ===");
        console.log("User ID:", decodeRefreshToken!.id);
        console.log("User Email:", decodeRefreshToken!.email);
        
        const newAccessToken = generateJWTToken(decodeRefreshToken!.id!, decodeRefreshToken.email!, "access");
        const newRefreshToken = generateJWTToken(decodeRefreshToken!.id!, decodeRefreshToken.email!, "refresh");
        
        console.log("New Access Token:", newAccessToken);
        console.log("New Refresh Token:", newRefreshToken);
        
        const newEncryptedRefreshToken = encryptData(newRefreshToken);
        console.log("New Encrypted Refresh Token:", newEncryptedRefreshToken);
        console.log("New Encrypted Token Length:", newEncryptedRefreshToken.length);
        
        await saveRefreshToken(newRefreshToken, newEncryptedRefreshToken);
        console.log("✅ New tokens saved successfully");

        setCookies(newAccessToken, newEncryptedRefreshToken, res);
        console.log("✅ New tokens set in cookies");
        return res.status(200).json({ 
            success: true, 
            message: "Tokens refreshed successfully",
            tokens: {
                accessToken: newAccessToken,
                refreshToken: newEncryptedRefreshToken,
                expiresIn: '1h'
            }
        });
    } else {
        console.log("Authentication failed - invalid tokens");
        return res.status(401).json({ success: false, message: "Not Authorized" });
    }
};
