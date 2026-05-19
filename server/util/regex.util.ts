export const HEX24_REGEX = /^[0-9a-fA-F]{24}$/;

export function escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
