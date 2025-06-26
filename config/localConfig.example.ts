import { LocalConfig } from "./localConfig.schema";

const localConfig: LocalConfig = {
    theme: {},
    Logo: false,
    footer: {
        socialMedias: [],
        showStatuteButton: {
            show: true,
        },
    },
    header: {
        donateButton: {
            show: true,
        },
        ctaButton: {
            show: true,
        },
    },
    home: {
        affixCTA: true,
        folderRedirectForum: {
            show: true,
            ctaButton: true,
        },
    },
};

export default localConfig;
