import { LocalConfig } from "./localConfig.schema";

const localConfig: LocalConfig = {
    theme: {},
    footer: {
        socialMedias: [],
        showStatuteButton: {
            show: true,
            redirectUrl: "",
        },
        repositoryLink: "",
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
