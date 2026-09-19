import {
    HttpException,
    HttpStatus,
    NotFoundException,
} from "@nestjs/common";
import { AllExceptionsFilter } from "./http-exception.filter";

describe("AllExceptionsFilter", () => {
    let filter: AllExceptionsFilter;
    let mockResponse: any;
    let mockRequest: any;
    let mockHost: any;

    beforeEach(() => {
        filter = new AllExceptionsFilter();
        mockResponse = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn().mockReturnThis(),
            redirect: vi.fn(),
            headersSent: false,
        };
        mockRequest = {
            method: "GET",
            url: "/api/test",
            originalUrl: "/api/test",
            ip: "127.0.0.1",
            headers: { "user-agent": "test-agent" },
            query: {},
            body: {},
            params: {},
            socket: { remoteAddress: "127.0.0.1" },
        };
        mockHost = {
            switchToHttp: () => ({
                getResponse: () => mockResponse,
                getRequest: () => mockRequest,
            }),
        };
    });

    describe("API requests", () => {
        it("should return JSON for API 404 errors", () => {
            mockRequest.originalUrl = "/api/reviewtask/hash/nonexistent";
            mockRequest.url = "/api/reviewtask/hash/nonexistent";

            filter.catch(
                new NotFoundException("Review task not found"),
                mockHost as any
            );

            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    statusCode: 404,
                })
            );
            expect(mockResponse.redirect).not.toHaveBeenCalled();
        });

        it("should return sanitized message for API 500 errors", () => {
            mockRequest.originalUrl = "/api/test";

            filter.catch(new Error("database connection failed"), mockHost as any);

            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    statusCode: 500,
                    message: "Internal server error",
                })
            );
        });

        it("should include requestId in API error responses", () => {
            mockRequest.originalUrl = "/api/test";
            mockRequest.headers["x-request-id"] = "req-123";

            filter.catch(new Error("test"), mockHost as any);

            expect(mockResponse.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    requestId: "req-123",
                })
            );
        });
    });

    describe("page requests", () => {
        it("should redirect to /404 for page 404 errors", () => {
            mockRequest.originalUrl = "/nonexistent-page";
            mockRequest.url = "/nonexistent-page";

            filter.catch(
                new NotFoundException("Page not found"),
                mockHost as any
            );

            expect(mockResponse.redirect).toHaveBeenCalledWith("/404");
            expect(mockResponse.json).not.toHaveBeenCalled();
        });

        it("should redirect to /404 for page 500 errors", () => {
            mockRequest.originalUrl = "/some-page";
            mockRequest.url = "/some-page";

            filter.catch(new Error("unexpected error"), mockHost as any);

            expect(mockResponse.redirect).toHaveBeenCalledWith("/404");
            expect(mockResponse.json).not.toHaveBeenCalled();
        });
    });

    describe("diagnostic logging", () => {
        it("should include userId in diagnostics when user is present", () => {
            mockRequest.originalUrl = "/api/test";
            (mockRequest as any).user = { _id: "user-123" };

            const logSpy = vi.spyOn(filter["logger"], "error").mockImplementation(() => {});

            filter.catch(new Error("test"), mockHost as any);

            expect(logSpy).toHaveBeenCalledWith(
                expect.stringContaining('"userId":"user-123"'),
                expect.any(String)
            );

            logSpy.mockRestore();
        });

        it("should log anonymous when user is not present", () => {
            mockRequest.originalUrl = "/api/test";

            const logSpy = vi.spyOn(filter["logger"], "error").mockImplementation(() => {});

            filter.catch(new Error("test"), mockHost as any);

            expect(logSpy).toHaveBeenCalledWith(
                expect.stringContaining('"userId":"anonymous"'),
                expect.any(String)
            );

            logSpy.mockRestore();
        });

        it("should include query params in diagnostics", () => {
            mockRequest.originalUrl = "/api/user";
            mockRequest.query = { searchName: "test", canAssignUsers: "true" };

            const logSpy = vi.spyOn(filter["logger"], "error").mockImplementation(() => {});

            filter.catch(new Error("test"), mockHost as any);

            expect(logSpy).toHaveBeenCalledWith(
                expect.stringContaining('"searchName":"test"'),
                expect.any(String)
            );

            logSpy.mockRestore();
        });

        it("should include body keys but not values in diagnostics", () => {
            mockRequest.originalUrl = "/api/test";
            mockRequest.body = { machine: { context: {} }, secret: "s3cr3t" };

            const logSpy = vi.spyOn(filter["logger"], "error").mockImplementation(() => {});

            filter.catch(new Error("test"), mockHost as any);

            const logCall = logSpy.mock.calls[0][0] as string;
            expect(logCall).toContain('"bodyKeys"');
            expect(logCall).toContain("machine");
            expect(logCall).toContain("secret");
            expect(logCall).not.toContain("s3cr3t");

            logSpy.mockRestore();
        });
    });

    describe("edge cases", () => {
        it("should not send response when headers already sent", () => {
            mockResponse.headersSent = true;
            mockRequest.originalUrl = "/api/test";

            filter.catch(new Error("test"), mockHost as any);

            expect(mockResponse.json).not.toHaveBeenCalled();
            expect(mockResponse.redirect).not.toHaveBeenCalled();
        });

        it("should handle headers-already-sent error silently", () => {
            mockRequest.originalUrl = "/api/test";

            filter.catch(
                new Error("Cannot set headers after they are sent to the client"),
                mockHost as any
            );

            expect(mockResponse.json).not.toHaveBeenCalled();
            expect(mockResponse.redirect).not.toHaveBeenCalled();
        });
    });
});
