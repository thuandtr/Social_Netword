import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware";
import { requireAdmin } from "../middlewares/admin.middleware";
import {
    getPublishedArticles,
    getPublicArticleById,
    getAllArticles,
    getAdminArticleById,
    createArticle,
    updateArticle,
    deleteArticle,
    handleImageUpload,
    uploadArticleImage,
} from "../handlers/article-handler";

const articleRouter = Router();

// ── Admin routes (auth + admin role required) ──────────────────────────────────
articleRouter.get("/admin", verifyToken, requireAdmin, getAllArticles);
articleRouter.get("/admin/:id", verifyToken, requireAdmin, getAdminArticleById);
articleRouter.post("/admin", verifyToken, requireAdmin, createArticle);
articleRouter.put("/admin/:id", verifyToken, requireAdmin, updateArticle);
articleRouter.delete("/admin/:id", verifyToken, requireAdmin, deleteArticle);
articleRouter.post(
    "/admin/upload-image",
    verifyToken,
    requireAdmin,
    uploadArticleImage.single("image"),
    handleImageUpload
);

// ── Public routes (no auth required) ──────────────────────────────────────────
articleRouter.get("/", getPublishedArticles);
articleRouter.get("/:id", getPublicArticleById);

export default articleRouter;
