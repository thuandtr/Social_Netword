import { Request, Response, NextFunction } from "express"
import { validateRefreshToken } from "../utils/helpers";

export const validateAuthTokens = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // console.log("Authorization header:", req.headers.authorization);
        
        if (!req.headers.authorization) {
            return res.status(400).json({ message: "Authorization header missing" });
        }

        const [_, refresh] = req!.headers!.authorization!.split(", ");
        console.log("Refresh token from header:", refresh);
        
        if (!refresh) {
            return res.status(400).json({ message: "Refresh token missing from header" });
        }

        const refreshToken = refresh.split("=")[1];
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