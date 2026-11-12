export const HEX24_REGEX = /^[0-9a-fA-F]{24}$/;

export function escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Letters Portuguese writes with diacritics, upper case included: Mongo's
// `i` option is not reliable outside ASCII.
const ACCENT_CLASSES: Record<string, string> = {
    a: "aáàâãäAÁÀÂÃÄ",
    e: "eéèêëEÉÈÊË",
    i: "iíìîïIÍÌÎÏ",
    o: "oóòôõöOÓÒÔÕÖ",
    u: "uúùûüUÚÙÛÜ",
    c: "cçCÇ",
    n: "nñNÑ",
};

/**
 * Escaped pattern that matches the text with or without accents, so
 * "saude" finds "Saúde" and "saúde" finds "saude".
 */
export function accentInsensitiveRegex(str: string): string {
    const plain = str.normalize("NFD").replace(/[̀-ͯ]/g, "");
    return escapeRegex(plain).replace(
        /[aeioucn]/gi,
        (letter) => `[${ACCENT_CLASSES[letter.toLowerCase()]}]`
    );
}
