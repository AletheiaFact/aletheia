import { LocalConfig } from "./localConfig.schema";

const showDonate = false;

const localConfig: LocalConfig = {
    theme: {
        colors: {
            bluePrimary: "#EC5F2A",
            white: "#f5f5f5",
            blackTertiary: "#1b1b1b",
            lightBlueSecondary: "#EC5F2A",
            lightBlueMain: "#f5f5f5",
        },
    },
    footer: {
        socialMedias: [],
        showStatuteButton: {
            show: showDonate,
            redirectUrl: "",
        },
    },
    header: {
        donateButton: {
            show: showDonate,
            redirectUrl: "",
        },
    },
    home: {
        affixCTA: false,
    },
};

export default localConfig;
