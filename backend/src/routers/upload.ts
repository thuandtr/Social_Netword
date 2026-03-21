import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware";
import { IMAGE_UPLOAD_PERMISSION, requirePermission } from "../middlewares/permissions.middleware";
import { uploadMiddleware, handleUpload } from "../handlers/upload-handler";

const uploadRouter = Router();

/**
 * POST /uploads
 * Upload a single image to Cloudinary.
 *
 * Query params:
 *   folder  (optional) — Cloudinary folder name, e.g. ?folder=avatars  (default: "general")
 *
 * Form data:
 *   image   — the image file (JPEG, PNG, GIF, WebP, SVG — max 10 MB)
 *
 * Returns:
 *   { url: string, public_id: string }
 */
uploadRouter.post(
    "/",
    verifyToken,
    requirePermission(IMAGE_UPLOAD_PERMISSION),
    uploadMiddleware.single("image"),
    handleUpload
);

export default uploadRouter;
