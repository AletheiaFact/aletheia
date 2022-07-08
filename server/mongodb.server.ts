import { MongoMemoryServer } from 'mongodb-memory-server';

(async () => {
    await MongoMemoryServer.create({instance:{port:35025}});
}) ()
