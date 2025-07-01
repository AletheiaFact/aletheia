import { z } from "zod";

const hexPattern = z
    .string()
    .regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/, "Invalid hex color code");

const LocalConfigSchema = z.object({
    theme: z.object({
        colors: z.object({
            primary: hexPattern,
            secondary: hexPattern,
            tertiary: hexPattern,
            quartiary: hexPattern,
            lightPrimary: hexPattern,
            lightSecondary: hexPattern,
            lightTertiary: hexPattern,
            black: hexPattern,
            blackSecondary: hexPattern,
            blackTertiary: hexPattern,
            neutral: hexPattern,
            neutralSecondary: hexPattern,
            neutralTertiary: hexPattern,
            lightNeutral: hexPattern,
            lightNeutralSecondary: hexPattern,
            white: hexPattern,
            warning: hexPattern,
            shadow: hexPattern,
            logo: hexPattern,
            error: hexPattern,
            active: hexPattern,
            inactive: hexPattern,
        }),
    }),
    Logo: z.boolean(),
    footer: z.object({
        socialMedias: z.array(z.string().url()).optional(),
        showStatuteButton: z.object({
            show: z.boolean(),
        }),
    }),
    header: z.object({
        donateButton: z.object({
            show: z.boolean(),
        }),
        ctaButton: z.object({
            show: z.boolean(),
        }),
    }),
    home: z.object({
        affixCTA: z.boolean(),
        folderRedirectForum: z.object({
            show: z.boolean(),
            ctaButton: z.boolean(),
        }),
    }),
});

export type LocalConfig = z.infer<typeof LocalConfigSchema>;
