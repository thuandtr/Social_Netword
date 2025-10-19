const generateTTL = (tokenExpire: number) => {
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    
    const secondsToExpire =  tokenExpire - currentTime;

    return secondsToExpire > 0 ? secondsToExpire : 0;
}

const generateRedisKey = (userId: string): string => {
    return `user-${userId}`;
}

export { generateTTL, generateRedisKey };