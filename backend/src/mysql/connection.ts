import { createPool, Pool } from "mysql2/promise";

let pool: Pool;

const connectToDatabase = async () => {
    try {
        pool = createPool({ 
            port: +process!.env!.MYSQL_PORT!,
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
         });
         await pool.getConnection();
         console.log("Database connected successfully");
    } catch (error) {
        console.error("Database connection failed:", error);
        throw error;
    }
}

export { connectToDatabase, pool };