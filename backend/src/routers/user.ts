import { Router } from "express";
import * as usersHandler from "../handlers/user-handler";
import { validateAuthTokens } from "../middlewares/jwt-token-validator";
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { downloadCV } from "../handlers/user-handler";

const usersRouter = Router();
// /api/v1/auth/user

// Why validateAuthTokens is needed even when authenticated:
// 1. Authentication != Authorization: Being logged in doesn't mean your tokens are still valid
// 2. Token expiration: Access tokens expire (1 hour), need validation on each request
// 3. Token tampering: Ensure tokens haven't been modified by malicious actors
// 4. User context: Extract user data (id, email) from token payload for the handler
// 5. Security layer: Verify the authorization header format and refresh token validity
usersRouter.get("/me", validateAuthTokens, usersHandler.getUser);
// Note: Next.js handles this differently with middleware.ts at route level

usersRouter.get("/username/:username", usersHandler.getUserByUsername);
usersRouter.get("/:id", usersHandler.getUserById);
usersRouter.post("/signup", usersHandler.createUser);
usersRouter.post("/login", usersHandler.loginUser);

// Download CV (requires authentication)
usersRouter.get("/download-cv/:username", validateAuthTokens, downloadCV);

// Update user details (creates row if not exists)
usersRouter.put("/details", validateAuthTokens, usersHandler.updateUserDetails);

// usersRouter.get("/details/me", validateAuthTokens, usersHandler.getCurrentUserDetails);
usersRouter.get("/details/:userId", usersHandler.getUserDetails);

// Configure Multer storage for uploads (limit 10MB, images only)
const uploadsDir = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
	fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
	destination: (_req: any, _file: any, cb: (error: Error | null, destination: string) => void) => cb(null, uploadsDir),
	filename: (_req: any, file: any, cb: (error: Error | null, filename: string) => void) => {
		const ext = path.extname(file.originalname) || '.bin';
		const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9-_]/g, '_');
		cb(null, `${Date.now()}_${base}${ext}`);
	}
});

const upload = multer({
	storage,
	limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
	fileFilter: (_req: any, file: any, cb: any) => {
		// Accept common image mime types
		if (/^image\/(png|jpe?g|gif|webp|bmp|svg\+xml)$/.test(file.mimetype)) return cb(null, true);
		return cb(new Error('Only image files are allowed'));
	}
});

// Upload endpoint - expects a single file field named "file"
// Returns the public URL under /uploads/
usersRouter.post('/upload', validateAuthTokens, upload.single('file'), (req, res) => {
	try {
		const file = (req as any).file as any;
		if (!file) {
			return res.status(400).json({ message: 'No file uploaded' });
		}
		
		// Determine the public-facing backend URL
		// In production/Docker: use the backend URL that the browser can access
		// In development: use localhost
		const publicBackendUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1/auth', '') 
			|| process.env.FRONTEND_URL?.replace('3000', '5000')
			|| `${req.protocol}://${req.get('host')}`.replace('backend', 'localhost');
		
		const publicUrl = `${publicBackendUrl}/uploads/${file.filename}`;
		
		console.log(`File uploaded: ${file.filename}`);
		console.log(`Public URL: ${publicUrl}`);
		
		return res.status(201).json({ 
			message: 'File uploaded', 
			url: publicUrl,
			filename: file.filename
		});
	} catch (err: any) {
		return res.status(500).json({ message: err?.message || 'Upload failed' });
	}
});

export default usersRouter;