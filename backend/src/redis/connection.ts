import { createClient } from "redis"

let redisClient = createClient({
    url: `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || '6379'}`
});

const initializeRedis = async () => {
    try {
        redisClient.on("error", (error) => {
            console.error("Redis Client Error", error);
        });
        await redisClient.connect();
        console.log("Redis connection successful");        
    } catch (error) {
        console.error("Redis connection failed:", error);
        throw error;
    }
}

export { redisClient, initializeRedis };