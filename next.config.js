// next.config.js
const withAntdLess = require('next-plugin-antd-less');

const { i18n } = require('./next-i18next.config');

module.exports = withAntdLess({
    productionBrowserSourceMaps: true,
    lessVarsFilePath: './src/styles/theme/_variables.less',
    lessVarsFilePathAppendToEndOfContent: false,
    // optional https://github.com/webpack-contrib/css-loader#object
    cssLoaderOptions: {},
    distDir: "./dist/.next",
    i18n,
    webpack(config) {
        return config;
    }
});
