import { z } from 'zod';

const hexPattern = z.string().regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/, 'Invalid hex color code');

const LocalConfigSchema = z.object({
    theme: z.object({
        colors: z.object({
            bluePrimary: hexPattern,
            white: hexPattern,
            blackPrimary: hexPattern,
            logoWhite: hexPattern,
            blackTertiary: hexPattern,
            blueSecondary: hexPattern,
            blueTertiary: hexPattern,
            blueQuartiary: hexPattern,
            grayPrimary: hexPattern,
            graySecondary: hexPattern,
            grayTertiary: hexPattern,
            lightGray: hexPattern,
            lightGraySecondary: hexPattern,
            lightBluePrimary: hexPattern,
            lightBlueMain: hexPattern,
            lightBlueSecondary: hexPattern,
            blackSecondary: hexPattern,
            lightYellow: hexPattern,
            redText: hexPattern,
            warning: hexPattern,
            active: hexPattern,
            inactive: hexPattern,
        }),
    }),
    footer: z.object({
        socialMedias: z.array(z.string().url()).optional(),
        showStatuteButton: z.object({
            show: z.boolean(),
            redirectUrl: z.string().url().optional(),
        }),
    }),
    header: z.object({
        donateButton: z.object({
            show: z.boolean(),
            redirectUrl: z.string().url().optional(),
        }),
    }),
    home: z.object({
        affixCTA: z.boolean(),
    }),
});

type LocalConfig = z.infer<typeof LocalConfigSchema>;

const localConfig: LocalConfig = {
    theme: {
        colors: {
            bluePrimary: "#11273a",
            blueSecondary: "#657e8e",
            blueTertiary: "#9bbcd1",
            blueQuartiary: "#b1c2cd",
            grayPrimary: "#4d4e4f",
            graySecondary: "#979a9b",
            grayTertiary: "#c2c8cc",
            lightGray: "#f5f5f5",
            lightGraySecondary: "#eeeeee",
            lightBluePrimary: "#dae8ea",
            lightBlueMain: "#4F8DB4",
            lightBlueSecondary: "#67bef2",
            white: "#ffffff",
            blackPrimary: "#111111",
            blackSecondary: "#515151",
            blackTertiary: "#202222",
            lightYellow: "#db9f0d",
            logoWhite: "#E8E8E8",
            redText: "#ff4d4f",
            warning: "#DB9F0D",
            active: "#49DE80",
            inactive: "#FBCC13",
        }
    },
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