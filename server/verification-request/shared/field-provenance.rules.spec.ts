import { Types } from "mongoose";
import { ProvenanceOrigin } from "../dto/types";
import {
    aiFieldUpdate,
    aiProvenance,
    creationProvenance,
    humanProvenance,
    humanProvenanceChanges,
    isHumanOwned,
    isTriageField,
    normalizeTriageValue,
    sameTriageValue,
    sentByIntegration,
} from "./field-provenance.rules";

const at = new Date("2026-10-14T12:00:00Z");

describe("field provenance rules", () => {
    it("isTriageField accepts only the four triage fields", () => {
        expect(isTriageField("severity")).toBe(true);
        expect(isTriageField("impactArea")).toBe(true);
        expect(isTriageField("topics")).toBe(true);
        expect(isTriageField("identifiedData")).toBe(true);
        expect(isTriageField("embedding")).toBe(false);
        expect(isTriageField("status")).toBe(false);
    });

    describe("normalizeTriageValue", () => {
        it("turns ObjectIds and populated documents into id strings", () => {
            const id = new Types.ObjectId();
            expect(normalizeTriageValue(id)).toBe(id.toString());
            expect(normalizeTriageValue({ _id: id, name: "Saúde" })).toBe(
                id.toString()
            );
            expect(normalizeTriageValue({ id: "uuid-1" })).toBe("uuid-1");
        });

        it("sorts lists and keeps plain strings", () => {
            expect(normalizeTriageValue(["b", "a"])).toEqual(["a", "b"]);
            expect(normalizeTriageValue("high_1")).toBe("high_1");
            expect(normalizeTriageValue(undefined)).toBeNull();
        });
    });

    it("sameTriageValue ignores list order and id representation", () => {
        const id = new Types.ObjectId();
        expect(sameTriageValue([id, "x"], ["x", id.toString()])).toBe(true);
        expect(sameTriageValue("low_1", "low_2")).toBe(false);
        expect(sameTriageValue(null, undefined)).toBe(true);
    });

    it("isHumanOwned is true only for human and edited origins", () => {
        expect(isHumanOwned({ origin: ProvenanceOrigin.HUMAN })).toBe(true);
        expect(
            isHumanOwned({ origin: ProvenanceOrigin.AI_EDITED_BY_HUMAN })
        ).toBe(true);
        expect(isHumanOwned({ origin: ProvenanceOrigin.AI })).toBe(false);
        expect(isHumanOwned({ origin: ProvenanceOrigin.INTEGRATION })).toBe(
            false
        );
        expect(isHumanOwned(undefined)).toBe(false);
    });

    it("sentByIntegration is true only for M2M users", () => {
        expect(sentByIntegration({ isM2M: true })).toBe(true);
        expect(sentByIntegration({ isM2M: false })).toBe(false);
        expect(sentByIntegration(undefined)).toBe(false);
        expect(sentByIntegration(null)).toBe(false);
    });

    describe("creationProvenance", () => {
        it("tells the reporter apart from an integration", () => {
            const id = new Types.ObjectId();
            expect(creationProvenance({ _id: id }, false)).toEqual({
                origin: ProvenanceOrigin.REPORTER,
                reporterValue: id.toString(),
            });
            expect(creationProvenance("area-1", true).origin).toBe(
                ProvenanceOrigin.INTEGRATION
            );
        });

        it("does not make the field human owned", () => {
            expect(isHumanOwned(creationProvenance("area-1", false))).toBe(
                false
            );
        });
    });

    describe("aiProvenance", () => {
        it("marks a new field as defined by the AI", () => {
            expect(
                aiProvenance(undefined, {
                    value: "high_1",
                    taskId: "task-1",
                    model: "jev-1.13.0",
                    at,
                })
            ).toEqual({
                origin: ProvenanceOrigin.AI,
                aiValue: "high_1",
                aiTaskId: "task-1",
                aiModel: "jev-1.13.0",
                aiAt: at,
            });
        });

        it("replaces a value sent with the request and keeps it", () => {
            expect(
                aiProvenance(creationProvenance("area-1", false), {
                    value: "area-2",
                    at,
                })
            ).toEqual({
                origin: ProvenanceOrigin.AI,
                reporterValue: "area-1",
                aiValue: "area-2",
                aiTaskId: undefined,
                aiModel: undefined,
                aiAt: at,
            });
        });

        it("keeps the human origin and only records the AI answer", () => {
            const previous = {
                origin: ProvenanceOrigin.HUMAN,
                humanUserId: "user-1",
                humanAt: at,
            };
            expect(aiProvenance(previous, { value: "low_1", at })).toEqual({
                ...previous,
                aiValue: "low_1",
                aiTaskId: undefined,
                aiModel: undefined,
                aiAt: at,
            });
        });
    });

    describe("aiFieldUpdate", () => {
        it("records nothing for fields outside the triage", () => {
            expect(
                aiFieldUpdate(undefined, "embedding", { value: [0.1], at })
            ).toEqual({ keepCurrentValue: false });
        });

        it("replaces a field the AI or the reporter defined", () => {
            const result = aiFieldUpdate(
                { severity: { origin: ProvenanceOrigin.AI, aiValue: "low_1" } },
                "severity",
                { value: "high_1", taskId: "task-2", at }
            );
            expect(result.keepCurrentValue).toBe(false);
            expect(result.provenance).toMatchObject({
                origin: ProvenanceOrigin.AI,
                aiValue: "high_1",
                aiTaskId: "task-2",
            });
        });

        it("keeps the value of a field a human owns", () => {
            const result = aiFieldUpdate(
                {
                    severity: {
                        origin: ProvenanceOrigin.HUMAN,
                        humanUserId: "user-1",
                    },
                },
                "severity",
                { value: "high_1", at }
            );
            expect(result.keepCurrentValue).toBe(true);
            expect(result.provenance).toMatchObject({
                origin: ProvenanceOrigin.HUMAN,
                humanUserId: "user-1",
                aiValue: "high_1",
            });
        });
    });

    describe("humanProvenance", () => {
        it("is an edit when the AI had answered the field", () => {
            const previous = {
                origin: ProvenanceOrigin.AI,
                aiValue: "high_1",
                aiAt: at,
            };
            expect(humanProvenance(previous, { userId: "user-1", at })).toEqual(
                {
                    ...previous,
                    origin: ProvenanceOrigin.AI_EDITED_BY_HUMAN,
                    humanUserId: "user-1",
                    humanAt: at,
                }
            );
        });

        it("is human when the AI never answered the field", () => {
            expect(humanProvenance(undefined, { userId: "user-1", at })).toEqual(
                {
                    origin: ProvenanceOrigin.HUMAN,
                    humanUserId: "user-1",
                    humanAt: at,
                }
            );
        });

        it("stores the user id as a string", () => {
            const userId = new Types.ObjectId();
            expect(
                humanProvenance(undefined, { userId: userId as any, at })
                    .humanUserId
            ).toBe(userId.toString());
        });
    });

    describe("humanProvenanceChanges", () => {
        const previous = {
            severity: { origin: ProvenanceOrigin.AI, aiValue: "high_1" },
            topics: { origin: ProvenanceOrigin.AI, aiValue: ["a", "b"] },
        };
        const before = { severity: "high_1", topics: ["a", "b"] };

        it("records only the triage fields whose value changed", () => {
            const changes = humanProvenanceChanges(
                previous,
                before,
                { severity: "low_1", topics: ["b", "a"], status: "Posted" },
                { userId: "user-1", at }
            );
            expect(Object.keys(changes)).toEqual(["severity"]);
            expect(changes.severity?.origin).toBe(
                ProvenanceOrigin.AI_EDITED_BY_HUMAN
            );
        });

        it("ignores fields left out of the update", () => {
            expect(
                humanProvenanceChanges(
                    previous,
                    before,
                    { publicationDate: "2026-10-14" },
                    { at }
                )
            ).toEqual({});
        });
    });
});
