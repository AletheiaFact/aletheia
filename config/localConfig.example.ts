import { LocalConfig } from "./localConfig.schema";

const localConfig: LocalConfig = {
    theme: {
        colors: {
            bluePrimary: "#EC5F2A",
            white: "#f5f5f5",
            blackTertiary: "#1b1b1b",
            lightBlueSecondary: "#EC5F2A",
            lightBlueMain: "#f5f5f5"
        }
    },
    footer: {
        socialMedias: ["teste 1", "teste 2", "teste 3", "teste 4"],
        showStatuteButton: {
            show: true,
            redirectUrl: "testandolinksStatuteButton",
        },
        repositoryLink: " https://github.com/AletheiaFact/Aletheia",
    },
    header: {
        donateButton: {
            show: true,
            redirectUrl: "TestandoDonateButton",
        },
    },
    home: {
        affixCTA: true,
    },
};

export default localConfig;
