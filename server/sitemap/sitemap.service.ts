import { Inject, Injectable } from "@nestjs/common";
import { SitemapStream, streamToPromise } from "sitemap";
import type { IClaimService } from "../interfaces/claim.service.interface";
import { ClaimReviewService } from "../claim-review/claim-review.service";
import type { IPersonalityService } from "../interfaces/personality.service.interface";

@Injectable()
export class SitemapService {
    constructor(
        @Inject("PersonalityService")
        private readonly personalityService: IPersonalityService,
        @Inject("ClaimService") private claimService: IClaimService,
        private claimReviewService: ClaimReviewService
    ) {}

    async getSitemap(hostname: string) {
        const sites: any[] = [
            { url: "/" },
            { url: "/about" },
            { url: "/privacy-policy" },
            { url: "/code-of-conduct" },
            { url: "/login" },
            { url: "/profile" },
            { url: "/personality" },
        ];

        const personalities: any[] = await this.personalityService.listAll(
            0,
            0,
            "asc",
            {},
            "pt",
            false
        );

        for (const personality of personalities) {
            if (!personality) {
                continue;
            }
            sites.push({ url: `/personality/${personality.slug}` });
            const claims = await this.claimService.listAll(0, 0, "asc", {
                personality: personality._id,
            });

            for (const claim of claims.data) {
                sites.push({
                    url: `/personality/${personality.slug}/claim/${claim.slug}`,
                });
                // This line may cause a false positive in sonarCloud because if we remove the await, we cannot iterate through the results
                const reviews =
                    await this.claimReviewService.getReviewClassificationCountsByClaimId(
                        claim._id
                    );
                for (const review of reviews) {
                    sites.push({
                        url: `/personality/${personality.slug}/claim/${claim.slug}/sentence/${review._id.data_hash}`,
                        priority: 1,
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

        return streamToPromise(sitemapStream);
    }
}
