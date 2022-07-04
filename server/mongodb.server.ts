import { MongoMemoryServer } from 'mongodb-memory-server';

(async () => {
    await MongoMemoryServer.create({instance:{port:35025}});
    const ServiceRunner = require("service-runner");
    new ServiceRunner().start();
}) ()
