import { UnauthorizedException } from "@nestjs/common";
import { UnauthorizedExceptionFilter } from "./unauthorized.filter";

describe("UnauthorizedExceptionFilter", () => {
    let filter: UnauthorizedExceptionFilter;
    let mockResponse: any;
    let mockRequest: any;
    let mockHost: any;

    beforeEach(() => {
        filter = new UnauthorizedExceptionFilter();
        mockResponse = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn().mockReturnThis(),
            redirect: vi.fn(),
        };
        mockRequest = {
            method: "GET",
            originalUrl: "/api/user",
        };
        mockHost = {
            switchToHttp: () => ({
                getResponse: () => mockResponse,
                getRequest: () => mockRequest,
            }),
        };
    });

    it("should return 401 JSON for API requests", () => {
        mockRequest.originalUrl = "/api/reviewtask/save-draft/abc123";
        mockRequest.method = "PUT";

        filter.catch(
            new UnauthorizedException(),
            mockHost as any
        );

        expect(mockResponse.status).toHaveBeenCalledWith(401);
        expect(mockResponse.json).toHaveBeenCalledWith({
            statusCode: 401,
            message: "Unauthorized",
            path: "/api/reviewtask/save-draft/abc123",
        });
        expect(mockResponse.redirect).not.toHaveBeenCalled();
    });

    it("should redirect to /unauthorized for page requests", () => {
        mockRequest.originalUrl = "/admin";

        filter.catch(
            new UnauthorizedException(),
            mockHost as any
        );

        expect(mockResponse.redirect).toHaveBeenCalledWith(
            "/unauthorized?originalUrl=%2Fadmin"
        );
        expect(mockResponse.json).not.toHaveBeenCalled();
    });

    it("should encode special characters in the redirect URL", () => {
        mockRequest.originalUrl = "/personality/test name/claim/hash?foo=bar&baz=1";

        filter.catch(
            new UnauthorizedException(),
            mockHost as any
        );

        expect(mockResponse.redirect).toHaveBeenCalledWith(
            `/unauthorized?originalUrl=${encodeURIComponent("/personality/test name/claim/hash?foo=bar&baz=1")}`
        );
    });
});
