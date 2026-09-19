import { ArgumentsHost } from "@nestjs/common";
import { DuplicateKeyError, NotImplementedError } from "./errors";
import { AllExceptionsFilter } from "../filters/http-exception.filter";

describe("NotImplementedError", () => {
    it("captures backend and method names", () => {
        const err = new NotImplementedError("postgres", "getReviewStats");
        expect(err.backend).toBe("postgres");
        expect(err.method).toBe("getReviewStats");
        expect(err.message).toContain("postgres");
        expect(err.message).toContain("getReviewStats");
    });

    it("is an instance of Error and NotImplementedError", () => {
        const err = new NotImplementedError("postgres", "x");
        expect(err).toBeInstanceOf(Error);
        expect(err).toBeInstanceOf(NotImplementedError);
        expect(err.name).toBe("NotImplementedError");
    });
});

describe("DuplicateKeyError", () => {
    it("captures the violated fields", () => {
        const err = new DuplicateKeyError(["wikidata"]);
        expect(err.fields).toEqual(["wikidata"]);
        expect(err.message).toContain("wikidata");
    });

    it("is an instance of Error and DuplicateKeyError", () => {
        const err = new DuplicateKeyError(["slug"]);
        expect(err).toBeInstanceOf(Error);
        expect(err).toBeInstanceOf(DuplicateKeyError);
        expect(err.name).toBe("DuplicateKeyError");
    });
});

describe("AllExceptionsFilter mapping for NotImplementedError", () => {
    const buildHost = () => {
        const json = vi.fn();
        const status = vi.fn().mockReturnValue({ json });
        const getResponse = vi.fn().mockReturnValue({ status });
        const getRequest = vi.fn().mockReturnValue({
            method: "GET",
            url: "/api/review-stats",
            headers: { "x-request-id": "req-test-123" },
            socket: {},
        });
        const host = {
            switchToHttp: () => ({ getResponse, getRequest }),
        } as unknown as ArgumentsHost;
        return { host, status, json };
    };

    it("returns HTTP 501 with structured body conforming to filter envelope", () => {
        const filter = new AllExceptionsFilter();
        const { host, status, json } = buildHost();

        filter.catch(
            new NotImplementedError("postgres", "getReviewStats"),
            host
        );

        expect(status).toHaveBeenCalledWith(501);
        expect(json).toHaveBeenCalledWith(
            expect.objectContaining({
                statusCode: 501,
                error: "Not Implemented",
                backend: "postgres",
                method: "getReviewStats",
                message: expect.stringContaining("getReviewStats"),
                requestId: expect.anything(),
                timestamp: expect.anything(),
                path: expect.anything(),
            })
        );
    });

    it("logs a warning with backend and method context", () => {
        const filter = new AllExceptionsFilter();
        const warnSpy = vi.spyOn(filter["logger"], "warn");
        const { host } = buildHost();

        filter.catch(
            new NotImplementedError("postgres", "getReviewStats"),
            host
        );

        expect(warnSpy).toHaveBeenCalled();
        const message = warnSpy.mock.calls[0][0];
        expect(String(message)).toContain("postgres");
        expect(String(message)).toContain("getReviewStats");
    });

    it("maps DuplicateKeyError to HTTP 409 with the violated fields", () => {
        const filter = new AllExceptionsFilter();
        const { host, status, json } = buildHost();

        filter.catch(new DuplicateKeyError(["wikidata"]), host);

        expect(status).toHaveBeenCalledWith(409);
        expect(json).toHaveBeenCalledWith(
            expect.objectContaining({
                statusCode: 409,
                error: "Conflict",
                fields: ["wikidata"],
                message: expect.stringContaining("wikidata"),
            })
        );
    });
});
