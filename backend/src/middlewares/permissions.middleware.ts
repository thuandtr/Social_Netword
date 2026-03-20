import { NextFunction, Request, Response } from "express";

export const ARTICLE_VIEW_PERMISSION = "article:view";
export const ARTICLE_CREATE_PERMISSION = "article:create";
export const ARTICLE_EDIT_PERMISSION = "article:edit";
export const ARTICLE_DELETE_PERMISSION = "article:delete";
export const IMAGE_UPLOAD_PERMISSION = "image:upload";

export const requirePermission = (permission: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ error: "Authentication required" });
        }

        // Admin keeps full access regardless of explicit permission list.
        if (req.user.role === "admin") {
            return next();
        }

        const permissions = Array.isArray(req.user.permissions) ? req.user.permissions : [];
        if (!permissions.includes(permission)) {
            return res.status(403).json({
                error: "Permission denied",
                requiredPermission: permission,
            });
        }

        return next();
    };
};
