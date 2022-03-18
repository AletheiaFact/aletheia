import { Injectable } from "@nestjs/common";
import { SitemapStream, streamToPromise } from "sitemap";
import { PersonalityService } from "../personality/personality.service";
import { ClaimService } from "../claim/claim.service";
import { ClaimReviewService } from "../claim-review/claim-review.service";

@Injectable()
export class SitemapService {
    constructor(
        private personalityService: PersonalityService,
        private claimService: ClaimService,
        private claimReviewService: ClaimReviewService
    ) {}

    async getSitemap(hostname) {
        const sites: any[] = [
            { url: "/" },
            { url: "/home" },
            { url: "/about" },
            { url: "/privacy-policy" },
            { url: "/code-of-conduct" },
            { url: "/login" },
            { url: "/profile" },
            { url: "/personality" },
        ];

        const personalities = await this.personalityService.listAll(
            0,
            0,
            "asc",
            {},
            "pt",
            false
        );

        for (const personality of personalities) {
            sites.push({ url: `/personality/${personality.slug}` });

            const claims = await this.claimService.listAll(0, 0, "asc", {
                personality: personality._id,
            });

            for (const claim of claims) {
                sites.push({
                    url: `/personality/${personality.slug}/claim/${claim.slug}`,
                });
                const reviews =
                    await this.claimReviewService.getReviewsByClaimId(
                        claim._id
                    );
                for (const review of reviews) {
                    sites.push({
                        url: `/personality/${personality.slug}/claim/${claim.slug}/sentence/${review._id}`,
                        priority: 0.9,
                    });
                }
            }
        }
        const sitemapStream = new SitemapStream({
            hostname,
        });
        for (const site of sites) {
            sitemapStream.write(site);
        }
        sitemapStream.end();
        const xml = await streamToPromise(sitemapStream);
        return xml;
    }
}
