import { z } from "zod";

const hexPattern = z
    .string()
    .regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/, "Invalid hex color code");

const LocalConfigSchema = z.object({
    theme: z.object({
        colors: z
            .object({
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
            })
            .partial()
            .optional(),
    }),
    Logo: z.boolean(),
    footer: z.object({
        showCallToAction: z.boolean(),
        socialMedias: z.object({
            useCustomUrls: z.boolean(),
            urls: z.array(z.string().url()).optional(),
        }),
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
    // The flags below are optional. When a flag is not set, the site keeps
    // the AletheiaFact behaviour (see src/utils/siteFeatures.ts).
    // committee.show: the National Committee page, its call-to-action
    // buttons and its report on the supportive materials page.
    committee: z
        .object({
            show: z.boolean(),
        })
        .optional(),
    // about.show: the about page and the links to it.
    about: z
        .object({
            show: z.boolean(),
        })
        .optional(),
    // organization: the publisher in the ClaimReview and MediaReview JSON-LD.
    organization: z
        .object({
            url: z.string().url(),
            sameAs: z.array(z.string().url()),
        })
        .optional(),
});

export type LocalConfig = z.infer<typeof LocalConfigSchema>;
