import { createClient } from "redis";

const redisClient = createClient({
    url: "redis://localhost:6379"
});

redisClient.on("error", (error) => {
    console.log(error);
});

if (!redisClient.isOpen) {
    redisClient.connect();
}

export default redisClient
