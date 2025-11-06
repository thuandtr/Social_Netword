import { redisClient, isRedisReady, waitForRedis } from './connection';

// Available: setCache function - stores data in Redis with expiry
const setCache = async (key: string, data: string, EX: number) => {
    try {
        // Check if Redis is ready
        if (!isRedisReady()) {
            console.warn("Redis not ready, waiting...");
            const ready = await waitForRedis(5000);
            if (!ready) {
                throw new Error("Redis connection not available");
            }
        }

        // EX: directly set expiry, NX: only set if key not exists
        await redisClient.set(key, data, { EX });
        console.log("✅ Redis: Set-Cache", key, "Value: ", data.substring(0, 50) + "...", "Expiry:", EX, "seconds");

        // Verify the data was actually saved
        const verifyValue = await redisClient.get(key);
        if (verifyValue === data) {
            console.log("✅ Redis: Cache verification successful");
        } else {
            console.error("❌ Redis: Cache verification FAILED - data mismatch");
            throw new Error("Cache verification failed");
        }
    } catch (error) {
        console.error("❌ Redis: Set-Cache Error", error);
        throw error;
    }
}

// Available: getCache function - retrieves data from Redis by key
const getCache = async (key: string) => {
    try {
        // Check if Redis is ready
        if (!isRedisReady()) {
            console.warn("Redis not ready for read operation");
            return null;
        }

        const value = await redisClient.get(key);
        console.log("Redis: Get-Cache", key, "Value: ", value ? value.substring(0, 50) + "..." : null);

        return value;
    } catch (error) {
        console.error("Redis: Get-Cache Error", error);
        throw error;
    }
}

export { setCache, getCache };