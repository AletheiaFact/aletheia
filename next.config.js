// next.config.js
const { i18n } = require("./next-i18next.config");

module.exports = {
    productionBrowserSourceMaps: true,
    distDir: "./dist/.next",
    i18n,
    images: {
        domains: ["i.creativecommons.org", "upload.wikimedia.org"],
    },
    compiler: {
        styledComponents: {
            displayName: true,
            ssr: true,
        },
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    transpilePackages: [
        "@ant-design/icons",
        "@ant-design/icons-svg",
        "rc-pagination",
        "rc-picker",
        "rc-util", // this is only needed for the Docker build
    ],
};
