// next.config.js
const withAntdLess = require("next-plugin-antd-less");

const { i18n } = require("./next-i18next.config");

module.exports = withAntdLess({
    productionBrowserSourceMaps: true,
    // optional https://github.com/webpack-contrib/css-loader#object
    distDir: "./dist/.next",
    i18n,
    webpack(config) {
        config.module.rules.push({
            test: /\.mjs$/,
            include: /node_modules/,
            type: "javascript/auto",
        });

        return config;
    },
    images: {
        domains: ["i.creativecommons.org", "upload.wikimedia.org"],
    },
    compiler: {
        styledComponents: {
            displayName: true,
            ssr: true,
        },
    },
});
