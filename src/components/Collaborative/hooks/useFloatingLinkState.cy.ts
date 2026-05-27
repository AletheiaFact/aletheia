import { validateUrl } from "../../../utils/ValidateUrl";

describe("URL Validation Tests", () => {
    const validUrls = [
        "https://example.com",
        "https://example.br",
        "https://example.org",
        "https://example.net",
        "https://example.edu",
        "https://example.gov",
        "https://example.mil",
        "https://example.co",
        "https://example.info",
        "https://example.io",
        "https://example.biz",
        "https://example.us",
        "https://example.uk",
        "ftp://example.com",
        "https://example.co",
        "https://subdomain.example.org"
    ];

    const mockT = (key) => key;

    validUrls.forEach((url) => {
        it(`should accept the URL: ${url}`, () => {
            const result = validateUrl(url, mockT);
            expect(result).to.equal("");
        });
    });

    describe("Invalid URL Scenarios", () => {
        it("should return error key for trailing space", () => {
            const result = validateUrl("https://example.com ", mockT);
            expect(result).to.equal("sourceForm:errorMessageTrailingSpace");
        });

        it("should return error key for trailing dot", () => {
            const result = validateUrl("https://example.com.", mockT);
            expect(result).to.equal("sourceForm:errorMessageTrailingDot");
        });

        it("should return error key for invalid URL format", () => {
            const result = validateUrl("invalid-url-text", mockT);
            expect(result).to.equal("sourceForm:errorMessageValidURL");
        });

        it("should return empty string if href is not provided", () => {
            const result = validateUrl("", mockT);
            expect(result).to.equal("common:requiredFieldError");
        });
    });
});
