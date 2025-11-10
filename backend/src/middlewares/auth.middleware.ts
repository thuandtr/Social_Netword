import { Request, Response, NextFunction } from "express";
import { validateAccessToken, validateRefreshToken } from "../utils/helpers";
import { decode } from "jsonwebtoken";
import { generateJWTToken, saveRefreshToken, verifyAndDecode } from "../token/jwt-token-manager";
import { encryptData } from "../encryption";
import { setCookies } from "../handlers/user-handler";

// Extend Request type to include user
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
            };
        }
    }
}

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

// Middleware to verify token and attach user to request
export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        let accessToken: string | undefined;
        let refreshToken: string | undefined;

        // Try to get tokens from Authorization header first
        if (authHeader) {
            if (authHeader.startsWith("Bearer ")) {
                accessToken = authHeader.substring(7);
            } else {
                // Handle the format: access_token=xxx, refresh_token=xxx
                const tokens = authHeader.split(", ");
                const accessTokenPart = tokens.find(t => t.startsWith("access_token="));
                const refreshTokenPart = tokens.find(t => t.startsWith("refresh_token="));
                
                if (accessTokenPart) {
                    accessToken = accessTokenPart.split("=")[1];
                }
                if (refreshTokenPart) {
                    refreshToken = refreshTokenPart.split("=")[1];
                }
            }
        }

        // Fallback to cookies if no tokens in header
        if (!accessToken && !refreshToken) {
            accessToken = req.cookies?.access_token;
            refreshToken = req.cookies?.refresh_token;
        }

        // If we have neither token, return 401
        if (!accessToken && !refreshToken) {
            return res.status(401).json({ error: "Authentication required" });
        }

        // Try to validate access token first
        let decoded: any = null;
        
        if (accessToken && accessToken.trim() !== '') {
            const isValid = await validateAccessToken(accessToken);
            if (isValid) {
                decoded = await verifyAndDecode(accessToken);
            }
        }

        // If access token is invalid/missing but we have refresh token, validate it
        if (!decoded && refreshToken) {
            const decodedRefreshToken = await validateRefreshToken(refreshToken);
            
            if (decodedRefreshToken) {
                // Generate new tokens
                const newAccessToken = generateJWTToken(decodedRefreshToken.id!, decodedRefreshToken.email!, "access");
                const newRefreshToken = generateJWTToken(decodedRefreshToken.id!, decodedRefreshToken.email!, "refresh");
                const newEncryptedRefreshToken = encryptData(newRefreshToken);
                
                await saveRefreshToken(newRefreshToken, newEncryptedRefreshToken);
                setCookies(newAccessToken, newEncryptedRefreshToken, res);
                
                // Decode the new access token for this request
                decoded = await verifyAndDecode(newAccessToken);
                
                console.log("✅ Tokens refreshed in verifyToken middleware");
            }
        }

        if (!decoded) {
            return res.status(401).json({ error: "Invalid or expired token" });
        }

        // Attach user to request
        req.user = {
            id: decoded.id,
            email: decoded.email
        };

        next();
    } catch (error) {
        console.error("Error in verifyToken middleware:", error);
        return res.status(401).json({ error: "Authentication failed" });
    }
};
