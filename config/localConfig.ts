export interface LocalConfig {
    footer: {
        socialMedias: string[];
        showStatuteButton: {
            show: boolean,
            redirectUrl: string,
        };
    };
    header: {
        languages: boolean | string[];
        donateButton: {
            show: boolean;
            redirectUrl: string;
        };
    };
    home: {
        affixCTA: boolean;
        share: { platform: string; url: string };
    };
}

const localConfig: LocalConfig = {

    footer: {
        socialMedias: [],
        showStatuteButton: {
            show: true,
            redirectUrl: "",
        },
    },
    header: {
        languages: ["pt", "en"], //pending
        donateButton: {
            show: true,
            redirectUrl: "",
        },
    },
    home: {
        affixCTA: true,
        share: { platform: "", url: "" }, //pending
    },
};

export default localConfig;
