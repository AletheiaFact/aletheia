import { MongoMemoryServer } from 'mongodb-memory-server';

// This will create an new instance of "MongoMemoryServer" and automatically start it
(async () => {
    const mongod = await MongoMemoryServer.create({instance:{port:35025}});

const uri = mongod.getUri();
console.log(uri)

const ServiceRunner = require("service-runner");
new ServiceRunner().start();


// The Server can be stopped again with
// await mongod.stop();
}) ()
