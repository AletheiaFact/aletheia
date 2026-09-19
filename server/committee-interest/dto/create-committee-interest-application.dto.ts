import { z } from "zod";

export const CreateCommitteeInterestApplicationSchema = z
    .object({
        fullName: z.string().min(1),
        email: z.string().email(),
        phone: z.string().min(1),
        city: z.string().min(1),
        state: z.string().min(1),
        country: z.string().min(1),
        region: z.string().optional().default(""),
        actingAs: z.string().min(1),
        institution: z.string().optional().default(""),
        role: z.string().optional().default(""),
        interestAreas: z.string().min(1),
        contributionTypes: z.string().min(1),
        availability: z.string().min(1),
        priorExperience: z.string().optional().default(""),
        motivation: z.string().min(1).max(500),
        consentData: z.literal(true),
        consentComms: z.literal(true),
        recaptcha: z.string().min(1),
    })
    .strict();

export type CreateCommitteeInterestApplicationDto = z.infer<
    typeof CreateCommitteeInterestApplicationSchema
>;
