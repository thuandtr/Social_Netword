import { Request, Response } from "express";
import { pool } from "../mysql/connection";
import { GET_USER_BY_EMAIL, GET_USER_BY_ID } from "../mysql/queries";
import { INSERT_USER_STATEMENT } from "../mysql/mutations";
import bcrypt from "bcrypt";

const getUser = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        if (!id || isNaN(Number(id))) return res.status(400).json({ message: "User ID is required" });

        const conn = await pool.getConnection();
        const [rows] = await conn.query(GET_USER_BY_ID, [id]);
        const users = rows as any[];

        if(!users || users.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        console.log("User Retrieved:", users);

        return res.status(200).json({ message: "User Retrieved", user: users[0] });
    } catch (error) {
        console.log("Error occured", error);
        return res.status(500).json({ message: "Unexprected Error occurred, Try agian later" });
        throw error;
    }
}

const getUserByEmail = async (email: string) => {
    try {
        const conn = await pool.getConnection();
        const [rows] = await conn.query(GET_USER_BY_EMAIL, [email]);

        const users = rows as any[];
        return users;
    } catch (error) {
        console.log("Error occurred", error);
    }
}

const createUser = async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(422).json({ message: "Username, Email and Password are required" });
        }

        const users = await getUserByEmail(email);

        if (users && users.length > 0) {
            return res.status(409).json({ message: `User with this email already exists, userId: ${users[0].id}` });
        }

        const password_hash = await bcrypt.hash(password, 10); 

        const conn = await pool.getConnection();
        const [result] = await conn.query(INSERT_USER_STATEMENT, [username, email, password_hash]);
        console.log("User Created:", result);

        return res.status(201).json({ message: "User Created", result });
    } catch (error) {
        console.log("Error occured", error);
        return res.status(500).json({ message: "Unexprected Error occurred, Try again later" });
        throw error;
    }
}

const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        console.log(email, password);
        if (!email || !password) {
            return res.status(422).json({ message: "Email and Password are required" });
        }

        const users = await getUserByEmail(email);
        
        if(!users || users.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        
        const user = users[0];
        console.log(user);

        const passwordHash = user.password_hash;
        
        // Verify the password
        const isPasswordValid = await bcrypt.compare(password, passwordHash);
        
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        return res.status(200).json({ message: "Login successful", user: { username: user.username, email: user.email } });
    } catch (error) {
        console.log("Login failed by Error: ", error);
        return res.status(500).json({ message: "Login failed, Please check again your Password" });
        throw error;
    }
}

export { getUser, createUser, loginUser };