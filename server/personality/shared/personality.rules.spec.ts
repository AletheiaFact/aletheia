import { BadRequestException, ConflictException } from "@nestjs/common";
import { DuplicateKeyError } from "../../database/errors";
import {
    deriveSlug,
    defaultDescription,
    extractClaimWithTextSummary,
    wikidataCreationError,
    wikidataUnavailableError,
    isExpectedCreationFailure,
    diffEditableFields,
    storedPersonalityView,
} from "./personality.rules";

describe("personality shared rules", () => {
    describe("deriveSlug", () => {
        it("lowercases and hyphenates", () => {
            expect(deriveSlug("Ada Lovelace")).toBe("ada-lovelace");
        });

        it("strips special characters (strict mode)", () => {
            expect(deriveSlug("José D'Ávila Jr.")).toBe("jose-davila-jr");
        });
    });

    describe("defaultDescription", () => {
        it("uses the wikidata description when provided", () => {
            expect(defaultDescription("Ada", "Mathematician")).toBe(
                "Mathematician"
            );
        });

        it("falls back to the templated default when missing or empty", () => {
            expect(defaultDescription("Ada", undefined)).toBe(
                "Personality: Ada"
            );
            expect(defaultDescription("Ada", null)).toBe("Personality: Ada");
            expect(defaultDescription("Ada", "")).toBe("Personality: Ada");
        });
    });

    describe("extractClaimWithTextSummary", () => {
        it("replaces parsed content with its text and wraps a single claim", () => {
            expect(
                extractClaimWithTextSummary({ content: { text: "t" } })
            ).toEqual([{ content: "t" }]);
            expect(extractClaimWithTextSummary([{ title: "x" }])).toEqual([
                { title: "x" },
            ]);
        });
    });
});

describe("wikidataCreationError", () => {
    it("returns nothing for an ok item", () => {
        expect(wikidataCreationError("ok")).toBeUndefined();
    });

    it("maps a deleted item to a 400 with a reason", () => {
        const error = wikidataCreationError("deleted");
        expect(error).toBeInstanceOf(BadRequestException);
        expect((error as BadRequestException).getResponse()).toMatchObject({
            reason: "deleted",
        });
    });

    it("maps a disallowed type to a 400 with a reason", () => {
        expect(
            (
                wikidataCreationError("not_allowed_type") as BadRequestException
            ).getResponse()
        ).toMatchObject({ reason: "not_allowed_type" });
    });

    it("maps an id in use to a 409", () => {
        expect(wikidataCreationError("in_use")).toBeInstanceOf(
            ConflictException
        );
    });

    describe("no_label status", () => {
        it("maps to a 400 with reason no_label", () => {
            const error: any = wikidataCreationError("no_label");
            expect(error.getStatus()).toBe(400);
            expect(error.getResponse()).toMatchObject({ reason: "no_label" });
        });
    });

    describe("wikidataUnavailableError", () => {
        it("is a 503", () => {
            expect(wikidataUnavailableError().getStatus()).toBe(503);
        });
    });

    describe("isExpectedCreationFailure", () => {
        it("accepts HTTP errors, duplicate keys and raw E11000", () => {
            expect(isExpectedCreationFailure(wikidataUnavailableError())).toBe(
                true
            );
            expect(
                isExpectedCreationFailure(new DuplicateKeyError(["wikidata"]))
            ).toBe(true);
            expect(isExpectedCreationFailure({ code: 11000 })).toBe(true);
        });
        it("rejects anything else", () => {
            expect(isExpectedCreationFailure(new Error("boom"))).toBe(false);
            expect(isExpectedCreationFailure(null)).toBe(false);
        });
    });

    describe("diffEditableFields", () => {
        const stored = { name: "A", description: "d", wikidata: null };
        it("returns only defined fields that differ", () => {
            expect(
                diffEditableFields(stored, {
                    name: "A",
                    description: "e",
                    wikidata: "Q1",
                })
            ).toEqual({ description: "e", wikidata: "Q1" });
        });
        it("returns nothing when the body is empty or unchanged", () => {
            expect(diffEditableFields(stored, {})).toEqual({});
            expect(diffEditableFields(stored, { name: "A" })).toEqual({});
        });
    });

    describe("storedPersonalityView", () => {
        const stored = {
            id: "1",
            name: "N",
            description: "D",
            wikidata: "Q1",
        };
        it("reports none without a check", () => {
            expect(
                storedPersonalityView({ ...stored, wikidata: null }, null)
            ).toEqual({
                _id: "1",
                name: "N",
                description: "D",
                wikidata: null,
                wikidataStatus: "none",
                wikidataProvides: { name: false, description: false },
            });
        });
        it("reports unavailable", () => {
            expect(
                storedPersonalityView(stored, "unavailable").wikidataStatus
            ).toBe("unavailable");
        });
        it("reports what an ok item provides", () => {
            const view = storedPersonalityView(stored, {
                status: "ok",
                props: { name: "x" },
            });
            expect(view.wikidataStatus).toBe("ok");
            expect(view.wikidataProvides).toEqual({
                name: true,
                description: false,
            });
        });
        it("provides nothing from a deleted item", () => {
            const view = storedPersonalityView(stored, {
                status: "deleted",
                props: { name: "x", description: "y" },
            });
            expect(view.wikidataStatus).toBe("deleted");
            expect(view.wikidataProvides).toEqual({
                name: false,
                description: false,
            });
        });
    });
});
