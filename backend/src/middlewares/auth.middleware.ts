import { Request, Response, NextFunction } from "express";
import { validateAccessToken, validateRefreshToken } from "../utils/helpers";
import { decode } from "jsonwebtoken";
import { generateJWTToken, saveRefreshToken, verifyAndDecode } from "../token/jwt-token-manager";
import { encryptData } from "../encryption";
import { setCookies } from "../handlers/user-handler";

const parseTokenPart = (part: string, key: string): string | undefined => {
    const prefix = `${key}=`;
    if (!part || !part.startsWith(prefix)) {
        return undefined;
    }
    return part.slice(prefix.length);
};

// Extend Request type to include user
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                role: string;
                permissions: string[];
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

    const tokens = authHeader.split(",").map((t) => t.trim());
    if (tokens.length !== 2) {
        return res.status(401).json({ error: "Invalid authorization header format" });
    }

    const [access, refresh] = tokens;
    const accessToken = parseTokenPart(access, "access_token");
    const refreshToken = parseTokenPart(refresh, "refresh_token");

    console.log("=== TOKEN DEBUGGING ===");
    console.log("Access Token from client:", accessToken);
    console.log("Refresh Token from client:", refreshToken);
    console.log("Access Token length:", accessToken ? accessToken.length : 0);
    console.log("Refresh Token length:", refreshToken ? refreshToken.length : 0);

    if (!refreshToken) {
        return res.status(401).json({ error: "Refresh token is required" });
    }

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
        
        const userRole = (decodeRefreshToken as any).role || 'user';
        const userPermissions = Array.isArray((decodeRefreshToken as any).permissions)
            ? (decodeRefreshToken as any).permissions
            : [];
        const newAccessToken = generateJWTToken(
            decodeRefreshToken!.id!,
            decodeRefreshToken.email!,
            "access",
            userRole,
            userPermissions
        );
        const newRefreshToken = generateJWTToken(
            decodeRefreshToken!.id!,
            decodeRefreshToken.email!,
            "refresh",
            userRole,
            userPermissions
        );
        
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
                const tokens = authHeader.split(",").map((t) => t.trim());
                const accessTokenPart = tokens.find(t => t.startsWith("access_token="));
                const refreshTokenPart = tokens.find(t => t.startsWith("refresh_token="));
                
                if (accessTokenPart) {
                    accessToken = parseTokenPart(accessTokenPart, "access_token");
                }
                if (refreshTokenPart) {
                    refreshToken = parseTokenPart(refreshTokenPart, "refresh_token");
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
                // Generate new tokens preserving the role from the refresh token
                const userRole = (decodedRefreshToken as any).role || 'user';
                const userPermissions = Array.isArray((decodedRefreshToken as any).permissions)
                    ? (decodedRefreshToken as any).permissions
                    : [];
                const newAccessToken = generateJWTToken(
                    decodedRefreshToken.id!,
                    decodedRefreshToken.email!,
                    "access",
                    userRole,
                    userPermissions
                );
                const newRefreshToken = generateJWTToken(
                    decodedRefreshToken.id!,
                    decodedRefreshToken.email!,
                    "refresh",
                    userRole,
                    userPermissions
                );
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
            email: decoded.email,
            role: (decoded as any).role || 'user',
            permissions: Array.isArray((decoded as any).permissions) ? (decoded as any).permissions : []
        };

        next();
    } catch (error) {
        console.error("Error in verifyToken middleware:", error);
        return res.status(401).json({ error: "Authentication failed" });
    }
};
