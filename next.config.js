const { i18n } = require('./next-i18next.config');
const { version } = require('./package.json');

module.exports = {
    productionBrowserSourceMaps: true,
    distDir: "./dist/.next",
    i18n,
    publicRuntimeConfig: {
        version,
    },
    webpack(config) {
        return config;
    },
    images: {
        domains: [
            'i.creativecommons.org',
            'upload.wikimedia.org'
        ]
    },
};