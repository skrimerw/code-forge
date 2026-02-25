import { createClient } from "redis";

const redisClient = createClient();

redisClient.on("error", (error) => {
    console.log(error);
});

if (!redisClient.isOpen) {
    redisClient.connect();
}

export default redisClient
