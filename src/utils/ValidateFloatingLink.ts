export const URL_PATTERN =
    /^(?!.*\.$)(ftp|http|https):\/\/[^ "]+\.[a-zA-Z]{2,}(\/|\?|#|$)/i;

/**
 * Validates if a string follows a proper URL format for external links.
 */
export const validateFloatingLink = (href?: string, t?: (key: string) => string) => {
    if (!href) return;

    if (href?.endsWith('.')) {
        throw new Error(t("sourceForm:errorMessageTrailingDot"));
    }

    if (!URL_PATTERN.test(href)) {
        throw new Error(t("sourceForm:errorMessageValidURL"));
    }
};

/**
 * Sanitizes URLs to prevent XSS attacks and ensure browser stability.
 * Allows only HTTP/HTTPS/Blob URLs and rejects all other protocols.
 */
export const sanitizeUrl = (url: string | undefined): string => {
    if (!url) return "";

    const trimmedUrl = url.trim();

    try {
        const parsed = new URL(trimmedUrl);
        const protocol = parsed.protocol.toLowerCase();
        if (protocol === "http:" || protocol === "https:" || protocol === "blob:") {
            return parsed.toString();
        }

        console.warn(`Blocked URL with unsupported protocol: ${protocol}`);
        return "";
    } catch {
        console.warn("Blocked URL: invalid format.");
        return "";
    }
};
