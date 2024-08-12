export interface LocalConfig {
    name: string,

    footer: {
        socialMedias: string[];
        showStatuteButton: {
            show: boolean,
            redirectUrl: string,
        };
        address: string;
        description: string;
        platformInfoTitle: string;
        contactEmail: string;
    };
    header: {
        languages: boolean | string[];
        donateButton: {
            show: boolean;
            redirectUrl: string;
            text: string;
        };
        logo: string;
    };
    home: {
        header: {
            title: string;
            message: string;
        };
        affixCTA: boolean;
        ctaBanner: {
            text: string;
        };
        share: { platform: string; url: string };
    };
}

const localConfig: LocalConfig = {
    name: "Federal da Paraíba",

    footer: {
        socialMedias: ["", "", "", ""],
        showStatuteButton: {
            show: true,
            redirectUrl: "",
        },
        address: "",
        description: "",
        platformInfoTitle: "",
        contactEmail: "",
    },
    header: {
        languages: ["pt", "en"], //pending
        donateButton: {
            show: true,
            redirectUrl: "",
            text: "",
        },
        logo: "", //pending
    },
    home: {
        header: {
            title: "",
            message: "",
        },
        affixCTA: true, //pending
        ctaBanner: {
            text: "",
        },
        share: { platform: "", url: "" }, //pending
    },
};

export default localConfig;
