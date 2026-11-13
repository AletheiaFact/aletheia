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

/**
 * Guards for user-supplied URLs before they reach an href or src. Each takes
 * one value and returns a boolean, so `isSafeX(url) ? url : undefined` keeps
 * the original string when it passes.
 */

/** An absolute http(s) URL, so `javascript:` and `data:` links never render. */
export const isSafeLinkUrl = (url: unknown): url is string =>
    typeof url === "string" && /^https?:\/\//i.test(url);

/** An image source that can't run script: http(s), blob, data:image or a same-origin path. */
export const isSafeImageSrc = (src: unknown): src is string =>
    typeof src === "string" &&
    /^(https?:\/\/|blob:|data:image\/|\/(?!\/))/i.test(src);

/** An https link to a Wikipedia page. */
export const isSafeWikipediaUrl = (url: unknown): url is string =>
    typeof url === "string" &&
    /^https:\/\/([a-z0-9-]+\.)*wikipedia\.org(\/|$)/i.test(url);
