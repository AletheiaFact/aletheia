import { MongoMemoryServer } from "mongodb-memory-server";

(async () => {
    const db = await MongoMemoryServer.create({
        instance: { port: 35026 },
        binary: { version: "6.0.17" },
    });
    console.info(db.getUri());
})();