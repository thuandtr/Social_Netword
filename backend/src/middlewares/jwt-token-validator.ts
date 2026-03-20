import { Request, Response, NextFunction } from "express"
import { validateRefreshToken } from "../utils/helpers";

const parseTokenPart = (part: string, key: string): string | null => {
    const prefix = `${key}=`;
    if (!part || !part.startsWith(prefix)) {
        return null;
    }
    return part.slice(prefix.length);
};

export const validateAuthTokens = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // console.log("Authorization header:", req.headers.authorization);
        
        if (!req.headers.authorization) {
            return res.status(400).json({ message: "Authorization header missing" });
        }

        const parts = req!.headers!.authorization!.split(",").map((p) => p.trim());
        const refresh = parts.find((part) => part.startsWith("refresh_token="));
        console.log("Refresh token from header:", refresh);
        
        if (!refresh) {
            return res.status(400).json({ message: "Refresh token missing from header" });
        }

        const refreshToken = parseTokenPart(refresh, "refresh_token");
        console.log("Extracted refresh token:", refreshToken);

        if (!refreshToken) {
            return res.status(400).json({ message: "Invalid refresh token format" });
        }

        const decryptedRefreshToken = await validateRefreshToken(refreshToken);

        if(!decryptedRefreshToken) {
            return res.status(401).json({ message: "Not Authorized" });
        }

        res.locals.jwtData = decryptedRefreshToken;
        return next();
    } catch (error) {
        console.error("Error in validateAuthTokens middleware:", error);
        return res.status(400).json({ message: "Invalid authorization format" });
    }
}