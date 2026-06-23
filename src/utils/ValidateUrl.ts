export const URL_PATTERN =
    /^(?!.*https?:\/\/.*https?:\/\/)(?:ftp|https?):\/\/[^ "]+\.[a-z]{2,}(?:[/?#]|$)/i;

/**
 * Validates if a string or an array of strings follows a proper URL format.
 */
export const validateUrl = (url: string | string[], t: (key: string) => string): string => {
    if (!url || (Array.isArray(url) && url.length === 0)) {
        return t("common:requiredFieldError");
    }

    if (Array.isArray(url)) {
        for (const singleUrl of url) {
            const error = validateUrl(singleUrl, t);
            if (error) return error;
        }
        return "";
    }

    if (!url.trim()) return t("common:requiredFieldError");
    if (url.endsWith('.')) return t("sourceForm:errorMessageTrailingDot");
    if (url.endsWith(" ")) return t("sourceForm:errorMessageTrailingSpace");
    if (!URL_PATTERN.test(url)) return t("sourceForm:errorMessageValidURL");

    return "";
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
        if (
            protocol === "http:" ||
            protocol === "https:" ||
            protocol === "blob:"
        ) {
            return parsed.toString();
        }

        console.warn(`Blocked URL with unsupported protocol: ${protocol}`);
        return "";
    } catch {
        console.warn("Blocked URL: invalid format.");
        return "";
    }
};
