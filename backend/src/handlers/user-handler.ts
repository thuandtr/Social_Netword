import { Request, Response } from "express";
import { pool } from "../mysql/connection";
import { GET_USER_BY_ID } from "../mysql/queries";
import { INSERT_USER_STATEMENT } from "../mysql/mutations";

const getUser = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        if (!id || isNaN(Number(id))) return res.status(400).json({ message: "User ID is required" });

        const conn = await pool.getConnection();
        const result = await conn.query(GET_USER_BY_ID, [id]);
        console.log("User Retrieved:", result);

        return res.status(200).json({ message: "User Retrieved", user: result[0] });
    } catch (error) {
        console.log("Error occured", error);
        return res.status(500).json({ message: "Unexprected Error occurred, Try agian later" });
        throw error;
    }
}

const createUser = async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(422).json({ message: "Username, Email and Password are required" });
        }

        const password_hash = password; // TODO: Hash Password

        const conn = await pool.getConnection();
        const result = await conn.query(INSERT_USER_STATEMENT, [username, email, password_hash]);
        console.log("User Created:", result);

        return res.status(201).json({ message: "User Created", user: result[0] });
    } catch (error) {
        console.log("Error occured", error);
        return res.status(500).json({ message: "Unexprected Error occurred, Try agian later" });
        throw error;
    }
}

export { getUser, createUser };