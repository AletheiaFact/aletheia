import {
    captchaToken,
    dataHash,
    email,
    isoDateTime,
    legacyBodyFlag,
    legacyQueryFlag,
    nonEmptyText,
    objectId,
    pageSizeQuery,
    queryArray,
    queryBoolean,
    queryInt,
    wikidataId,
    entityId,
} from "./index";
import { z } from "zod";

describe("lib/schemas primitives", () => {
    it("objectId", () => {
        expect(objectId.safeParse("507f1f77bcf86cd799439011").success).toBe(
            true
        );
        expect(objectId.safeParse("507f1f77bcf86cd79943901").success).toBe(
            false
        );
        expect(objectId.safeParse({ $ne: null }).success).toBe(false);
    });

    it("entityId accepts an ObjectId or a uuid", () => {
        expect(entityId.safeParse("64b7f0c2e1a2b3c4d5e6f701").success).toBe(
            true
        );
        expect(
            entityId.safeParse("3f2504e0-4f89-41d3-9a0c-0305e82c3301").success
        ).toBe(true);
        expect(entityId.safeParse("nope").success).toBe(false);
    });

    it("dataHash", () => {
        expect(dataHash.safeParse("a".repeat(32)).success).toBe(true);
        expect(dataHash.safeParse("g".repeat(32)).success).toBe(false);
    });

    it("wikidataId", () => {
        expect(wikidataId.safeParse("Q42").success).toBe(true);
        expect(wikidataId.safeParse("42").success).toBe(false);
    });

    it("nonEmptyText trims and bounds", () => {
        expect(nonEmptyText(3).parse("  ab ")).toBe("ab");
        expect(nonEmptyText(3).safeParse("   ").success).toBe(false);
        expect(nonEmptyText(3).safeParse("abcd").success).toBe(false);
    });

    it("email normalizes before validating", () => {
        expect(email.parse("  Foo@Example.COM ")).toBe("foo@example.com");
        expect(email.safeParse("nope").success).toBe(false);
    });

    it("captchaToken", () => {
        expect(captchaToken.safeParse("").success).toBe(false);
    });

    it("isoDateTime requires an offset", () => {
        expect(isoDateTime.safeParse("2026-09-30T12:00:00Z").success).toBe(
            true
        );
        expect(isoDateTime.safeParse("2026-09-30T12:00:00-03:00").success).toBe(
            true
        );
        expect(isoDateTime.safeParse("2026-09-30").success).toBe(false);
    });
});

describe("lib/schemas query helpers", () => {
    it("queryInt coerces and rejects non-integers", () => {
        expect(queryInt.parse("10")).toBe(10);
        expect(queryInt.safeParse("abc").success).toBe(false);
        expect(queryInt.safeParse("1.5").success).toBe(false);
    });

    it("pageSizeQuery bounds", () => {
        expect(pageSizeQuery(50).safeParse("50").success).toBe(true);
        expect(pageSizeQuery(50).safeParse("51").success).toBe(false);
        expect(pageSizeQuery(50).safeParse("0").success).toBe(false);
    });

    it("queryBoolean is strict", () => {
        expect(queryBoolean.parse("true")).toBe(true);
        expect(queryBoolean.parse("0")).toBe(false);
        expect(queryBoolean.safeParse("maybe").success).toBe(false);
        expect(queryBoolean.parse(true)).toBe(true);
    });

    it("legacyQueryFlag matches the class-transformer idiom exactly", () => {
        for (const v of [true, "enabled", "true", 1, "1"]) {
            expect(legacyQueryFlag.parse(v)).toBe(true);
        }
        for (const v of [false, "false", "0", 0, "yes", "", undefined]) {
            expect(legacyQueryFlag.parse(v)).toBe(false);
        }
    });

    it("legacyBodyFlag coerces present values and leaves an absent key unset", () => {
        expect(legacyBodyFlag.parse("enabled")).toBe(true);
        expect(legacyBodyFlag.parse("yes")).toBe(false);
        expect(legacyBodyFlag.optional().parse(undefined)).toBeUndefined();
        expect(legacyBodyFlag.safeParse(null).success).toBe(false);
    });

    it("queryArray normalizes single and repeated values", () => {
        const schema = queryArray(z.string());
        expect(schema.parse("a")).toEqual(["a"]);
        expect(schema.parse(["a", "b"])).toEqual(["a", "b"]);
        expect(schema.safeParse({ $ne: "a" }).success).toBe(false);
    });
});
