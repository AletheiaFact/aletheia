/**
 * CI canary (Decision D4.2 — no silent skips): a green DB_TYPE-matrixed CI
 * job must PROVE the suite ran under the intended backend, because
 * env-driven describe.skipIf gates fail green when the env doesn't arrive.
 * The matrix job sets CI_EXPECT_DB_TYPE; if the effective DB_TYPE doesn't
 * match, the job fails loudly. Inert locally (CI_EXPECT_DB_TYPE unset).
 */
describe("DB_TYPE canary", () => {
    it("effective DB_TYPE matches CI_EXPECT_DB_TYPE when set", () => {
        const expected = process.env.CI_EXPECT_DB_TYPE;
        if (!expected) return;
        expect(process.env.DB_TYPE ?? "mongodb").toBe(expected);
    });
});
