import { LocalConfig } from "./localConfig.schema";

const localConfig: LocalConfig = {
    theme: {},
    Logo: false,
    footer: {
        socialMedias: [],
        showStatuteButton: {
            show: true,
            redirectUrl: "",
        },
        repositoryUrl: "",
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
