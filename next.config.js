const { i18n } = require('./next-i18next.config');

module.exports = {
    productionBrowserSourceMaps: true,
    distDir: "./dist/.next",
    i18n,
    webpack(config) {
        // Fix Yjs duplicate import issue
        config.resolve.alias = {
            ...config.resolve.alias,
            'yjs': require.resolve('yjs')
        };
        return config;
    },
    images: {
        domains: [
            'i.creativecommons.org',
            'upload.wikimedia.org'
        ]
    },
};