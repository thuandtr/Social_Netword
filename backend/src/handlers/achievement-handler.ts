import { Request, Response } from "express";
import { pool } from "../mysql/connection";
import { GET_ACTIVE_COMPANY_ACHIEVEMENTS } from "../mysql/queries";

/** GET /achievements — returns active company achievements for homepage showcase */
export const getCompanyAchievements = async (_req: Request, res: Response) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const [rows] = await conn.query(GET_ACTIVE_COMPANY_ACHIEVEMENTS);
        return res.status(200).json({ achievements: rows });
    } catch (error) {
        console.error("getCompanyAchievements error:", error);
        return res.status(500).json({ error: "Failed to fetch company achievements" });
    } finally {
        if (conn) conn.release();
    }
};
