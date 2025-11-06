import app from "./app";
import { config } from "dotenv";
import { connectToDatabase } from "./mysql/connection";
import { initializeRedis } from "./redis/connection";
import { 
    validateConfiguration, 
    validateAllConnections, 
    printStartupBanner,
    printReadyBanner 
} from "./config/config-validator";

config();

const init = async () => {
    try {
        // Print startup banner
        printStartupBanner();

        // Step 1: Validate configuration
        const configResult = validateConfiguration();
        if (!configResult.valid) {
            console.error("💥 Configuration validation failed!");
            console.error("Fix the errors above and restart the server.\n");
            process.exit(1);
        }

        // Step 2: Validate service connections
        const connectionsOk = await validateAllConnections();
        if (!connectionsOk) {
            console.error("💥 Service connection validation failed!");
            console.error("Ensure MySQL and Redis are running and accessible.\n");
            process.exit(1);
        }

        // Step 3: Connect to services
        console.log("🔌 Establishing service connections...\n");
        await connectToDatabase();
        await initializeRedis();
        console.log("✅ Service connections established\n");

        // Step 4: Start server
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            printReadyBanner(PORT);
        });
    } catch (error) {
        console.error("💥 Server initialization failed:", error);
        process.exit(1);
    }
}

init();