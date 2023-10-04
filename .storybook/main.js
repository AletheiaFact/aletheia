module.exports = {
    stories: ["../src/stories/**/*.stories.*"],

    addons: [
        "@storybook/addon-links",
        "@storybook/addon-essentials",
        "@storybook/addon-interactions",
        "@storybook/preset-ant-design",
    ],

    framework: {
        name: "@storybook/nextjs",
        options: {},
    },

    webpackFinal: async (config, { configType }) => {
        config.resolve.alias = {
            ...config.resolve.alias,
            "next-i18next": "react-i18next",
        };
        return config;
    },

    docs: {
        autodocs: true,
    },
};
