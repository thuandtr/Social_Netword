import app from "./app";
import { config } from "dotenv";
import { connectToDatabase } from "./mysql/connection";

config();

const init = async () => {
    try {
        await connectToDatabase();
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
        console.log("Server is running on port: ", PORT);
    });
    } catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1);
    }

    
}

init();