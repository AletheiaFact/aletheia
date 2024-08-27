import { LocalConfig } from "./localConfig.schema";

const showDonate = false;

const localConfig: LocalConfig = {
    theme: {
        colors: {
            primary: "#EC5F2A",
            white: "#f5f5f5",
            blackTertiary: "#1b1b1b",
            lightSecondary: "#EC5F2A",
            lightPrimary: "#f5f5f5",
        },
    },
    Logo: true,
    footer: {
        socialMedias: [],
        showStatuteButton: {
            show: showDonate,
        },
    },
    header: {
        donateButton: {
            show: showDonate,
        },
    },
    home: {
        affixCTA: false,
    },
};

export default localConfig;
