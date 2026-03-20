export const URL_PATTERN =
    /^(?!.*\.$)(ftp|http|https):\/\/[^ "]+\.[a-zA-Z]{2,}(\/|\?|#|$)/i;

export const validateFloatingLink = (href?: string, t?: (key: string) => string) => {
    if (href?.endsWith('.')) {
        throw new Error(t("sourceForm:errorMessageTrailingDot"));
    }

    if (!URL_PATTERN.test(href)) {
        throw new Error(t("sourceForm:errorMessageValidURL"));
    }
};


export const sanitizeUrl = (url: string | undefined) => {
    if (!url) return "";

    const trimmedUrl = url.trim();

    if (
        trimmedUrl.startsWith("http://") ||
        trimmedUrl.startsWith("https://") ||
        trimmedUrl.startsWith("data:image/")
    ) {
        return trimmedUrl;
    }

    console.warn(`Blocked potentially unsafe URL: ${trimmedUrl}`);
    return "";
};
