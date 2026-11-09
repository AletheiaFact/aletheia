export const TestConfigOptions = {
    config: {
        port: 3000,
        cors: "*",
        debug: true,
        recaptcha_secret: process.env.TEST_RECAPTCHA_SECRET,
        recaptcha_sitekey: process.env.TEST_RECAPTCHA_SITEKEY,
        throttle: {
            ttl: 60,
        },
        limit: 1000,
        // Not "ory": overrideGuard() replaces only @UseGuards guards, so the
        // global SessionOrM2MGuard still runs the real SessionGuard. With
        // "ory" it would call an Ory that does not exist in CI and return
        // 503; any other value skips the lookup and lets /api requests
        // through to the per-route guard mocks.
        authentication_type: "none",
        ory: {
            url: process.env.ORY_SDK_URL,
            access_token: process.env.ORY_ACCESS_TOKEN,
            schema_id: process.env.ALETHEIA_SCHEMA_ID,
        },
        db: {
            connection_uri: process.env.CI_MONGODB_URI,
            type: "mongodb",
            options: {},
        },
        feature_flag: {
            url: process.env.GITLAB_FEATURE_FLAG_URL,
            appName: process.env.ENV,
            instanceId: process.env.GITLAB_FEATURE_FLAG_INSTANCE_ID,
        },
        nextjs: {
            dir: "../",
        },
    },
};
