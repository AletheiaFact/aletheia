import { z } from "zod";
import { captchaToken, nonEmptyText, objectId } from "../../../lib/schemas";

// The event form sends the wikidata pick ({ label, value, aliases, ... });
// API clients may send { name }. Normalized so `name` is always set.
const MainTopicSchema = z
    .looseObject({
        label: z.string().optional(),
        name: z.string().optional(),
        value: z.string().optional(),
        wikidataId: z.string().optional(),
        language: z.string().optional(),
    })
    .transform((topic, ctx) => {
        const name = topic.label ?? topic.name;
        if (!name) {
            ctx.addIssue({
                code: "custom",
                message: "mainTopic requires a label or name",
                path: ["name"],
            });
            return z.NEVER;
        }
        return { ...topic, name };
    });

const FilterTopicSchema = z.looseObject({
    name: z.string().min(1),
    label: z.string().optional(),
    value: z.string().optional(),
    wikidataId: z.string().optional(),
    language: z.string().optional(),
});

const ParticipantSchema = z.strictObject({
    organization: objectId,
    order: z.number().int().min(0),
});

const ParticipantsSchema = z
    .array(ParticipantSchema)
    .max(50)
    .refine(
        (participants) =>
            new Set(participants.map(({ organization }) => organization))
                .size === participants.length,
        { error: "An organization can only participate once" }
    );
export type EventParticipantDto = z.output<typeof ParticipantSchema>;

const EventFieldsSchema = z.strictObject({
    nameSpace: z.string().optional(),
    badge: nonEmptyText(100),
    name: nonEmptyText(300),
    description: nonEmptyText(5000),
    location: nonEmptyText(300),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    mainTopic: MainTopicSchema,
    participants: ParticipantsSchema.optional(),
    recaptcha: captchaToken.optional(),
});

// Parity with the legacy @IsAfter("startDate"): an endDate needs a startDate
// in the same payload and must be strictly later.
const endDateAfterStartDate = (event: { startDate?: Date; endDate?: Date }) =>
    event.endDate === undefined ||
    (event.startDate !== undefined &&
        event.endDate.getTime() > event.startDate.getTime());

const endDateError = {
    error: "endDate must be a date later than startDate",
    path: ["endDate"],
};

export const CreateEventSchema = EventFieldsSchema.refine(
    endDateAfterStartDate,
    endDateError
);
export type CreateEventDto = z.output<typeof CreateEventSchema>;

export const UpdateEventSchema = EventFieldsSchema.partial()
    .extend({ filterTopics: z.array(FilterTopicSchema).optional() })
    .refine(endDateAfterStartDate, endDateError);
export type UpdateEventDto = z.output<typeof UpdateEventSchema>;
