import { Router } from "express";
import * as usersHandler from "../handlers/user-handler";
import { validateAuthTokens } from "../middlewares/jwt-token-validator";

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

usersRouter.get("/:id", usersHandler.getUserById);
usersRouter.post("/signup", usersHandler.createUser);
usersRouter.post("/login", usersHandler.loginUser);

export default usersRouter;