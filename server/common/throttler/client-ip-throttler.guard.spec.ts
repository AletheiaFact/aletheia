import { resolveClientIp } from "./client-ip-throttler.guard";

describe("resolveClientIp", () => {
    it("uses the CF-Connecting-IP header when Cloudflare sends it", () => {
        expect(
            resolveClientIp({
                ip: "10.0.0.5",
                headers: { "cf-connecting-ip": "203.0.113.7" },
            })
        ).toBe("203.0.113.7");
    });

    it("gives two visitors behind the same proxy different keys", () => {
        const a = resolveClientIp({
            ip: "10.0.0.5",
            headers: { "cf-connecting-ip": "203.0.113.7" },
        });
        const b = resolveClientIp({
            ip: "10.0.0.5",
            headers: { "cf-connecting-ip": "198.51.100.2" },
        });
        expect(a).not.toBe(b);
    });

    it("falls back to req.ip when the header is missing", () => {
        expect(resolveClientIp({ ip: "127.0.0.1", headers: {} })).toBe(
            "127.0.0.1"
        );
    });

    it("falls back to req.ip when the header is empty or not a string", () => {
        expect(
            resolveClientIp({
                ip: "127.0.0.1",
                headers: { "cf-connecting-ip": "  " },
            })
        ).toBe("127.0.0.1");
        expect(
            resolveClientIp({
                ip: "127.0.0.1",
                headers: { "cf-connecting-ip": ["1.1.1.1", "2.2.2.2"] },
            })
        ).toBe("127.0.0.1");
    });
});
