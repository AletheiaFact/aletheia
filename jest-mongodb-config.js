module.exports = {
    mongodbMemoryServerOptions: {
        binary: {
            version: '6.0.13',
            skipMD5: true,
        },
        instance: {
            dbName: 'jest',
        },
        autoStart: false,
    },
    mongoURLEnvName: 'MONGO_URI',
};
