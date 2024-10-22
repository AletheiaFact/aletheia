import { z } from "zod";

const hexPattern = z
    .string()
    .regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/, "Invalid hex color code");

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
    Logo: z.boolean(),
    footer: z.object({
        socialMedias: z.array(z.string().url()).optional(),
        showStatuteButton: z.object({
            show: z.boolean(),
            redirectUrl: z.string().url().optional(),
        }),
        repositoryUrl: z.string().url().optional(),
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

export type LocalConfig = z.infer<typeof LocalConfigSchema>;
