import { Request, Response } from "express";
import { pool } from "../mysql/connection";
import {
    GET_PUBLISHED_ARTICLES,
    GET_ALL_ARTICLES,
    GET_ARTICLE_BY_ID_PUBLIC,
    GET_ARTICLE_BY_ID_ADMIN,
} from "../mysql/queries";
import { INSERT_ARTICLE, UPDATE_ARTICLE, DELETE_ARTICLE } from "../mysql/mutations";
import multer from "multer";
import cloudinary from "../config/cloudinary";

// ─── Multer setup for article thumbnails (memory → Cloudinary) ────────────────
const uploadToCloudinary = (buffer: Buffer): Promise<string> =>
    new Promise((resolve, reject) => {
        cloudinary.uploader
            .upload_stream({ folder: "articles", resource_type: "image" }, (error, result) => {
                if (error || !result) return reject(error ?? new Error("Cloudinary upload failed"));
                resolve(result.secure_url);
            })
            .end(buffer);
    });

export const uploadArticleImage = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
    fileFilter: (_req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Only image files are allowed"));
        }
    },
});

// ─── Public handlers ───────────────────────────────────────────────────────────

/** GET /articles  — returns all published articles (public) */
export const getPublishedArticles = async (req: Request, res: Response) => {
    let conn;
    try {
        const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
        const offset = parseInt(req.query.offset as string) || 0;

        conn = await pool.getConnection();
        const [rows] = await conn.query(GET_PUBLISHED_ARTICLES, [limit, offset]);
        const articles = (rows as any[]).map((a) => ({
            ...a,
            tags: safeParse(a.tags),
        }));

        return res.status(200).json({ articles });
    } catch (error) {
        console.error("getPublishedArticles error:", error);
        return res.status(500).json({ error: "Failed to fetch articles" });
    } finally {
        if (conn) conn.release();
    }
};

/** GET /articles/:id — returns a single published article (public) */
export const getPublicArticleById = async (req: Request, res: Response) => {
    let conn;
    try {
        const { id } = req.params;
        if (!id || isNaN(Number(id))) {
            return res.status(400).json({ error: "Invalid article ID" });
        }

        conn = await pool.getConnection();
        const [rows] = await conn.query(GET_ARTICLE_BY_ID_PUBLIC, [id]);
        const articles = rows as any[];

        if (!articles.length) {
            return res.status(404).json({ error: "Article not found" });
        }

        const article = { ...articles[0], tags: safeParse(articles[0].tags) };
        return res.status(200).json({ article });
    } catch (error) {
        console.error("getPublicArticleById error:", error);
        return res.status(500).json({ error: "Failed to fetch article" });
    } finally {
        if (conn) conn.release();
    }
};

// ─── Admin handlers ────────────────────────────────────────────────────────────

/** GET /admin/articles — returns ALL articles including drafts (admin only) */
export const getAllArticles = async (req: Request, res: Response) => {
    let conn;
    try {
        const limit = Math.min(parseInt(req.query.limit as string) || 50, 200);
        const offset = parseInt(req.query.offset as string) || 0;

        conn = await pool.getConnection();
        const [rows] = await conn.query(GET_ALL_ARTICLES, [limit, offset]);
        const articles = (rows as any[]).map((a) => ({
            ...a,
            tags: safeParse(a.tags),
        }));

        return res.status(200).json({ articles });
    } catch (error) {
        console.error("getAllArticles error:", error);
        return res.status(500).json({ error: "Failed to fetch articles" });
    } finally {
        if (conn) conn.release();
    }
};

/** GET /admin/articles/:id — returns any article by ID (admin only) */
export const getAdminArticleById = async (req: Request, res: Response) => {
    let conn;
    try {
        const { id } = req.params;
        if (!id || isNaN(Number(id))) {
            return res.status(400).json({ error: "Invalid article ID" });
        }

        conn = await pool.getConnection();
        const [rows] = await conn.query(GET_ARTICLE_BY_ID_ADMIN, [id]);
        const articles = rows as any[];

        if (!articles.length) {
            return res.status(404).json({ error: "Article not found" });
        }

        const article = { ...articles[0], tags: safeParse(articles[0].tags) };
        return res.status(200).json({ article });
    } catch (error) {
        console.error("getAdminArticleById error:", error);
        return res.status(500).json({ error: "Failed to fetch article" });
    } finally {
        if (conn) conn.release();
    }
};

/** POST /admin/articles — create a new article (admin only) */
export const createArticle = async (req: Request, res: Response) => {
    let conn;
    try {
        const authorId = req.user!.id;
        const { title, content, excerpt, thumbnail_url, status = "draft", category, tags } = req.body;

        if (!title || !title.trim()) {
            return res.status(422).json({ error: "Title is required" });
        }
        if (!content || !content.trim()) {
            return res.status(422).json({ error: "Content is required" });
        }

        const tagsJson = tags ? JSON.stringify(typeof tags === "string" ? JSON.parse(tags) : tags) : null;

        conn = await pool.getConnection();
        const [result] = await conn.query(INSERT_ARTICLE, [
            title.trim(),
            content.trim(),
            excerpt?.trim() || null,
            thumbnail_url || null,
            authorId,
            status === "published" ? "published" : "draft",
            category?.trim() || null,
            tagsJson,
        ]);

        const articleId = (result as any).insertId;
        return res.status(201).json({ message: "Article created", articleId });
    } catch (error) {
        console.error("createArticle error:", error);
        return res.status(500).json({ error: "Failed to create article" });
    } finally {
        if (conn) conn.release();
    }
};

/** PUT /admin/articles/:id — update an article (admin only) */
export const updateArticle = async (req: Request, res: Response) => {
    let conn;
    try {
        const { id } = req.params;
        if (!id || isNaN(Number(id))) {
            return res.status(400).json({ error: "Invalid article ID" });
        }

        const { title, content, excerpt, thumbnail_url, status, category, tags } = req.body;

        if (!title || !title.trim()) {
            return res.status(422).json({ error: "Title is required" });
        }
        if (!content || !content.trim()) {
            return res.status(422).json({ error: "Content is required" });
        }

        const tagsJson = tags ? JSON.stringify(typeof tags === "string" ? safeParse(tags) : tags) : null;

        conn = await pool.getConnection();
        const [result] = await conn.query(UPDATE_ARTICLE, [
            title.trim(),
            content.trim(),
            excerpt?.trim() || null,
            thumbnail_url || null,
            status === "published" ? "published" : "draft",
            category?.trim() || null,
            tagsJson,
            id,
        ]);

        const affected = (result as any).affectedRows;
        if (affected === 0) {
            return res.status(404).json({ error: "Article not found" });
        }

        return res.status(200).json({ message: "Article updated" });
    } catch (error) {
        console.error("updateArticle error:", error);
        return res.status(500).json({ error: "Failed to update article" });
    } finally {
        if (conn) conn.release();
    }
};

/** DELETE /admin/articles/:id — delete an article (admin only) */
export const deleteArticle = async (req: Request, res: Response) => {
    let conn;
    try {
        const { id } = req.params;
        if (!id || isNaN(Number(id))) {
            return res.status(400).json({ error: "Invalid article ID" });
        }

        conn = await pool.getConnection();
        const [result] = await conn.query(DELETE_ARTICLE, [id]);
        const affected = (result as any).affectedRows;

        if (affected === 0) {
            return res.status(404).json({ error: "Article not found" });
        }

        return res.status(200).json({ message: "Article deleted" });
    } catch (error) {
        console.error("deleteArticle error:", error);
        return res.status(500).json({ error: "Failed to delete article" });
    } finally {
        if (conn) conn.release();
    }
};

/** POST /admin/articles/upload-image — upload a thumbnail image to Cloudinary (admin only) */
export const handleImageUpload = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No image file provided" });
        }
        const imageUrl = await uploadToCloudinary(req.file.buffer);
        return res.status(200).json({ url: imageUrl });
    } catch (error) {
        console.error("handleImageUpload error:", error);
        return res.status(500).json({ error: "Failed to upload image" });
    }
};

// ─── Utility ───────────────────────────────────────────────────────────────────
const safeParse = (val: any) => {
    if (val === null || val === undefined) return null;
    if (typeof val !== "string") return val;
    try {
        return JSON.parse(val);
    } catch {
        return null;
    }
};
