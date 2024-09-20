import { LocalConfig } from "./localConfig.schema";

const localConfig: LocalConfig = {
    theme: {},
    footer: {
        socialMedias: [],
        showStatuteButton: {
            show: true,
            redirectUrl: "",
        },
    },
    header: {
        donateButton: {
            show: true,
            redirectUrl: "",
        },
    },
    home: {
        affixCTA: true,
    },
};

export default localConfig;
