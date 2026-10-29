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

    // Encode every user-controlled segment so a decoded "//host" in the
    // namespace or hash can never produce a protocol-relative redirect.
    const segments =
        namespace !== NameSpaceEnum.Main ? [encodeURIComponent(namespace)] : [];
    segments.push("personality", personalitySlug, "claim", slug);
    if (data_hash) {
        segments.push("sentence", encodeURIComponent(data_hash));
    }
    const redirectUrl = `/${segments.join("/")}`;

    return res.redirect(redirectUrl);
}
