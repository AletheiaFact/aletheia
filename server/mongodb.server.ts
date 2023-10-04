import { MongoMemoryServer } from "mongodb-memory-server";

(async () => {
    const db = await MongoMemoryServer.create({ instance: { port: 35025 } });
    console.info(db.getUri());
})();
