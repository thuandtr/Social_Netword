import { Request, Response } from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

// ─── Multer: in-memory storage ─────────────────────────────────────────────────
export const uploadMiddleware = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: MAX_FILE_SIZE },
    fileFilter: (_req, file, cb) => {
        if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error(`Unsupported file type. Allowed: ${ALLOWED_MIME_TYPES.join(", ")}`));
        }
    },
});

// ─── Cloudinary upload helper ──────────────────────────────────────────────────
const streamUpload = (buffer: Buffer, folder: string, filename: string): Promise<string> =>
    new Promise((resolve, reject) => {
        cloudinary.uploader
            .upload_stream(
                {
                    folder,
                    public_id: filename,
                    resource_type: "image",
                    overwrite: false,
                },
                (error, result) => {
                    if (error || !result) return reject(error ?? new Error("Cloudinary upload failed"));
                    resolve(result.secure_url);
                }
            )
            .end(buffer);
    });

// ─── Handler ───────────────────────────────────────────────────────────────────

/**
 * POST /uploads
 * Accepts a single image file (field name: "image") and uploads it to Cloudinary.
 * Optionally accepts a `folder` query param to organise images (default: "general").
 *
 * Response: { url: string, public_id: string }
 */
export const handleUpload = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No image file provided" });
        }

        const folder = typeof req.query.folder === "string" && req.query.folder.trim()
            ? req.query.folder.trim()
            : "general";

        // Build a deterministic-enough public_id from timestamp + original name stem
        const stem = req.file.originalname.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "_");
        const publicId = `${Date.now()}-${stem}`;

        const url = await streamUpload(req.file.buffer, folder, publicId);

        return res.status(200).json({ url, public_id: `${folder}/${publicId}` });
    } catch (error: any) {
        console.error("handleUpload error:", error);
        return res.status(500).json({ error: error?.message ?? "Failed to upload image" });
    }
};
