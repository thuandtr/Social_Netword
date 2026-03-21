import { redisClient, isRedisReady, waitForRedis } from './connection';

const REDIS_COMMAND_TIMEOUT_MS = 3000;

const withTimeout = async <T>(operation: Promise<T>, timeoutMs: number, action: string): Promise<T> => {
    let timeoutHandle: NodeJS.Timeout;

    const timeoutPromise = new Promise<never>((_, reject) => {
        timeoutHandle = setTimeout(() => {
            reject(new Error(`Redis ${action} timeout after ${timeoutMs}ms`));
        }, timeoutMs);
    });

    try {
        return await Promise.race([operation, timeoutPromise]);
    } finally {
        clearTimeout(timeoutHandle!);
    }
}

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
        await withTimeout(redisClient.set(key, data, { EX }), REDIS_COMMAND_TIMEOUT_MS, 'SET');
        console.log("✅ Redis: Set-Cache", key, "Value: ", data.substring(0, 50) + "...", "Expiry:", EX, "seconds");
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

        const value = await withTimeout(redisClient.get(key), REDIS_COMMAND_TIMEOUT_MS, 'GET');
        console.log("Redis: Get-Cache", key, "Value: ", value ? value.substring(0, 50) + "..." : null);

        return value;
    } catch (error) {
        console.error("Redis: Get-Cache Error", error);
        throw error;
    }
}

export { setCache, getCache };