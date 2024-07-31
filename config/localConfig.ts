export interface LocalConfig {
    footer: {
        organizationName: string;
        socialMedias: string[];
        showStatuteButton: boolean;
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
    footer: {
        socialMedias: [""],
        organizationName: "",
        showStatuteButton: true,
        address: "",
        description: "",
        platformInfoTitle: "",
        contactEmail: "",
    },
    header: {
        languages: ["pt", "en"],
        donateButton: {
            show: true,
            redirectUrl: "",
        },
        logo: "",
    },
    home: {
        header: {
            title: "",
            message: "",
        },
        affixCTA: true,
        ctaBanner: {
            text: "",
        },
        share: { platform: "", url: "" },
    },
};

export default localConfig;
