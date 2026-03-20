import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware";
import {
    ARTICLE_CREATE_PERMISSION,
    ARTICLE_DELETE_PERMISSION,
    ARTICLE_EDIT_PERMISSION,
    ARTICLE_VIEW_PERMISSION,
    IMAGE_UPLOAD_PERMISSION,
    requirePermission,
} from "../middlewares/permissions.middleware";
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
articleRouter.get("/admin", verifyToken, requirePermission(ARTICLE_VIEW_PERMISSION), getAllArticles);
articleRouter.get("/admin/:id", verifyToken, requirePermission(ARTICLE_VIEW_PERMISSION), getAdminArticleById);
articleRouter.post("/admin", verifyToken, requirePermission(ARTICLE_CREATE_PERMISSION), createArticle);
articleRouter.put("/admin/:id", verifyToken, requirePermission(ARTICLE_EDIT_PERMISSION), updateArticle);
articleRouter.delete("/admin/:id", verifyToken, requirePermission(ARTICLE_DELETE_PERMISSION), deleteArticle);
articleRouter.post(
    "/admin/upload-image",
    verifyToken,
    requirePermission(IMAGE_UPLOAD_PERMISSION),
    uploadArticleImage.single("image"),
    handleImageUpload
);

// ── Public routes (no auth required) ──────────────────────────────────────────
articleRouter.get("/", getPublishedArticles);
articleRouter.get("/:id", getPublicArticleById);

export default articleRouter;
