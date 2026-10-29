import slugify from "slugify";
import type { Response } from "express";
import { NameSpaceEnum } from "../auth/name-space/schemas/name-space.schema";

export function redirectBasedOnPersonality(
    res: Response,
    claim: any,
    namespace: string,
    data_hash: string | null = null
) {
    const { personalities, slug } = claim;
    if (personalities.length <= 0) {
        return;
    }

    const personalitySlug = slugify(personalities[0].name, {
        lower: true,
        strict: true,
    });

    let redirectUrl =
        namespace !== NameSpaceEnum.Main
            ? `/${namespace}/personality/${personalitySlug}/claim/${slug}`
            : `/personality/${personalitySlug}/claim/${slug}`;

    if (data_hash) {
        redirectUrl += `/sentence/${data_hash}`;
    }

    return res.redirect(redirectUrl);
}
