import { createClient } from "redis"

let redisClient = createClient({
    url: `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || '6379'}`
});

// Track Redis connection state
let isRedisConnected = false;

const initializeRedis = async () => {
    try {
        redisClient.on("error", (error) => {
            console.error("Redis Client Error", error);
            isRedisConnected = false;
        });

        redisClient.on("connect", () => {
            console.log("Redis client connecting...");
        });

        redisClient.on("ready", () => {
            console.log("Redis connection ready and operational");
            isRedisConnected = true;
        });

        redisClient.on("end", () => {
            console.log("Redis connection closed");
            isRedisConnected = false;
        });

        await redisClient.connect();
        console.log("Redis connection successful");        
    } catch (error) {
        console.error("Redis connection failed:", error);
        isRedisConnected = false;
        throw error;
    }
}

// Helper function to check if Redis is ready
const isRedisReady = (): boolean => {
    return isRedisConnected && redisClient.isReady;
}

// Helper function to wait for Redis to be ready
const waitForRedis = async (timeoutMs: number = 5000): Promise<boolean> => {
    const startTime = Date.now();
    while (!isRedisReady()) {
        if (Date.now() - startTime > timeoutMs) {
            console.error("Timeout waiting for Redis connection");
            return false;
        }
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    return true;
}

export { redisClient, initializeRedis, isRedisReady, waitForRedis };