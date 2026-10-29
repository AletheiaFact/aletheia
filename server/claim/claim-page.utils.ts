import slugify from "slugify";
import type { Response } from "express";
import { NameSpaceEnum } from "../auth/name-space/schemas/name-space.schema";

const SAFE_SEGMENT_REGEX = /^[a-zA-Z0-9_-]+$/;

function isSafeSegment(value: string): boolean {
    return SAFE_SEGMENT_REGEX.test(value);
}

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

    const allowedNamespaces = new Set<string>(Object.values(NameSpaceEnum));
    const safeNamespace =
        allowedNamespaces.has(namespace) && namespace !== NameSpaceEnum.Main
            ? namespace
            : null;

    const safeClaimSlug = isSafeSegment(String(slug)) ? String(slug) : null;
    if (!safeClaimSlug) {
        return;
    }

    const segments = safeNamespace ? [safeNamespace] : [];
    segments.push("personality", personalitySlug, "claim", safeClaimSlug);

    if (data_hash && isSafeSegment(data_hash)) {
        segments.push("sentence", data_hash);
    }

    const redirectUrl = `/${segments.join("/")}`;

    return res.redirect(redirectUrl);
}
