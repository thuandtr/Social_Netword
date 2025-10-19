import { redisClient } from './connection';
import { generateRedisKey , generateTTL } from '../utils/helpers';

// Available: setCache function - stores data in Redis with expiry
const setCache = async (key: string, data: string, EX: number) => {
    try {
        // EX: directly set expiry, NX: only set if key not exists
        await redisClient.set(key, data, { EX });
        console.log("Redis: Set-Cache", key, "Value: ", data)
    } catch (error) {
        console.error("Redis: Set-Cache Error", error);
        throw error;
    }
}

// Available: getCache function - retrieves data from Redis by key
const getCache = async (key: string) => {
    try {
        const value = await redisClient.get(key);
        console.log("Redis: Get-Cache", key, "Value: ", value);

        return value;
    } catch (error) {
        console.error("Redis: Get-Cache Error", error);
        throw error;
    }
}

export { setCache, getCache };