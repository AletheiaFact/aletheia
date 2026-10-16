import {
    buildProgress,
    calculateAverageDuration,
    computeDataHash,
    extractSeverity,
    filterValidSources,
    findRemovedIds,
    hashResult,
    nextMissingState,
    runnableMissingStates,
    stalePendingTaskFields,
    validateAiTaskResult,
} from "./verification-request.rules";

describe("verification-request rules", () => {
    it("computeDataHash is md5 of the content", () => {
        expect(computeDataHash("hello")).toBe(
            "5d41402abc4b2a76b9719d911017c592"
        );
    });

    it("filterValidSources keeps only entries with a non-blank href", () => {
        expect(
            filterValidSources([
                { href: " " },
                { href: "https://a" },
                null as any,
                {} as any,
            ])
        ).toEqual([{ href: "https://a" }]);
        expect(filterValidSources(undefined)).toEqual([]);
    });

    it("findRemovedIds compares by string form", () => {
        expect(
            findRemovedIds(
                { content: [{ toString: () => "a" }, "b", "c"] },
                { content: ["b"] }
            ).map(String)
        ).toEqual(["a", "c"]);
    });

    it("hashResult is stable for equal JSON", () => {
        expect(hashResult({ a: 1 })).toBe(hashResult({ a: 1 }));
        expect(hashResult({ a: 1 })).not.toBe(hashResult({ a: 2 }));
    });

    describe("validateAiTaskResult", () => {
        const isValidId = (id: any) => typeof id === "string" && id.length > 3;

        it("embedding needs a non-empty numeric array", () => {
            expect(validateAiTaskResult("embedding", [], isValidId).valid).toBe(
                false
            );
            expect(
                validateAiTaskResult("embedding", [1, "x"], isValidId).valid
            ).toBe(false);
            expect(
                validateAiTaskResult("embedding", [0.1, 0.2], isValidId).valid
            ).toBe(true);
        });

        it("topics need a non-empty array of valid ids using the backend predicate", () => {
            expect(validateAiTaskResult("topics", [], isValidId).valid).toBe(
                false
            );
            expect(
                validateAiTaskResult("topics", ["ab"], isValidId).valid
            ).toBe(false);
            expect(
                validateAiTaskResult("topics", ["abcd"], isValidId).valid
            ).toBe(true);
        });

        it("identifiedData accepts empty and valid id arrays only", () => {
            expect(
                validateAiTaskResult("identifiedData", null, isValidId).valid
            ).toBe(true);
            expect(
                validateAiTaskResult("identifiedData", [], isValidId).valid
            ).toBe(true);
            expect(
                validateAiTaskResult("identifiedData", ["abcd"], isValidId)
                    .valid
            ).toBe(true);
            expect(
                validateAiTaskResult("identifiedData", ["ab"], isValidId).valid
            ).toBe(false);
            expect(
                validateAiTaskResult("identifiedData", "x", isValidId).valid
            ).toBe(false);
        });

        it("impactArea must be truthy and severity must be in the enum", () => {
            expect(
                validateAiTaskResult("impactArea", null, isValidId).valid
            ).toBe(false);
            expect(
                validateAiTaskResult("impactArea", "x", isValidId).valid
            ).toBe(true);
            expect(
                validateAiTaskResult("severity", "nope", isValidId).valid
            ).toBe(false);
            expect(
                validateAiTaskResult("severity", "high_2", isValidId).valid
            ).toBe(true);
        });
    });

    it("extractSeverity reads a string or the severity key", () => {
        expect(extractSeverity("low_1")).toBe("low_1");
        expect(extractSeverity({ severity: "critical" })).toBe("critical");
        expect(extractSeverity({})).toBeUndefined();
    });

    it("nextMissingState skips executed and pending states and stops after severity", () => {
        expect(nextMissingState([], () => false)).toBe("embedding");
        expect(
            nextMissingState(["embedding"], (s) => s === "identifiedData")
        ).toBe("topics");
        expect(nextMissingState(["severity"], () => false)).toBeUndefined();
    });

    it("runnableMissingStates honors the prerequisites", () => {
        expect(runnableMissingStates([])).toEqual([
            "embedding",
            "identifiedData",
        ]);
        expect(runnableMissingStates(["embedding", "identifiedData"])).toEqual([
            "topics",
            "impactArea",
        ]);
        expect(
            runnableMissingStates([
                "embedding",
                "identifiedData",
                "topics",
                "impactArea",
            ])
        ).toEqual(["severity"]);
        expect(runnableMissingStates(["severity"])).toEqual([]);
    });

    it("calculateAverageDuration and buildProgress", () => {
        expect(calculateAverageDuration([])).toBe(0);
        expect(
            calculateAverageDuration([{ duration: 10 }, { duration: 30 }])
        ).toBe(20);
        const progress = buildProgress(
            ["embedding", "identifiedData"],
            [{ duration: 1000 }],
            0
        );
        expect(progress).toMatchObject({
            current: "identifiedData",
            completed: 2,
            total: 5,
            percentage: 40,
        });
        expect(progress.estimatedCompletion.getTime()).toBe(3000);
        expect(buildProgress([], [], 0).estimatedCompletion).toBeUndefined();
    });

    it("stalePendingTaskFields returns completed-but-pending fields and timed-out ones", () => {
        const now = 1_000_000;
        expect(
            stalePendingTaskFields(
                ["embedding", "topics"],
                ["embedding"],
                new Date(now - 10),
                100,
                now
            )
        ).toEqual(["embedding"]);
        expect(
            stalePendingTaskFields(
                ["topics"],
                [],
                new Date(now - 500),
                100,
                now
            )
        ).toEqual(["topics"]);
    });
});
