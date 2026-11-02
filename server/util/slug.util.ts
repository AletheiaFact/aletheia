import slugify from "slugify";
import { escapeRegex } from "./regex.util";

export const toSlug = (text: string): string =>
    slugify(text, { lower: true, strict: true, trim: true });

/** Mongo filter matching `base` and its suffixed variants (base-2, base-3, ...). */
export const slugVariantsFilter = (base: string) => ({
    slug: { $regex: `^${escapeRegex(base)}(-\\d+)?$` },
});

/** `base` when free, otherwise the first free `base-N` (N >= 2). */
export const firstFreeSlug = (base: string, taken: Set<string>): string => {
    if (!taken.has(base)) {
        return base;
    }
    let suffix = 2;
    while (taken.has(`${base}-${suffix}`)) {
        suffix++;
    }
    return `${base}-${suffix}`;
};
