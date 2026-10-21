import { withDbMetrics } from "./db-metrics";

describe("withDbMetrics", () => {
    it("reports latency per method and the error name on rejection", async () => {
        const samples: any[] = [];
        const service = withDbMetrics(
            "TopicService",
            "postgres",
            {
                ok: async (x: number) => x * 2,
                sync: () => 1,
                fail: async () => {
                    throw new TypeError("boom");
                },
                value: 3,
            },
            (s) => samples.push(s)
        );
        expect(await service.ok(2)).toBe(4);
        expect(service.sync()).toBe(1);
        expect(service.value).toBe(3);
        await expect(service.fail()).rejects.toThrow("boom");
        expect(samples.map((s) => [s.method, s.error])).toEqual([
            ["ok", undefined],
            ["sync", undefined],
            ["fail", "TypeError"],
        ]);
        expect(samples[0]).toMatchObject({
            token: "TopicService",
            backend: "postgres",
        });
        expect(typeof samples[0].ms).toBe("number");
    });
});
