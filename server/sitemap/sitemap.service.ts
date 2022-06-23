import { Injectable, Logger } from "@nestjs/common";
import { SitemapStream, streamToPromise } from "sitemap";
import { PersonalityService } from "../personality/personality.service";
import { ClaimService } from "../claim/claim.service";
import { ClaimReviewService } from "../claim-review/claim-review.service";
const axios = require("axios");

@Injectable()
export class SitemapService {
    constructor(
        private personalityService: PersonalityService,
        private claimService: ClaimService,
        private claimReviewService: ClaimReviewService
    ) {}
    private readonly logger = new Logger("SitemapService");

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

        // TODO: Add a loop strategy that paginates the results to improve performance
        const personalities: any[] = await this.personalityService.listAll(
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
                // This line may cause a false positive in sonarCloud because if we remove the await, we cannot iterate through the results
                //TODO: maybe with the changes, we have to change something
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

        return streamToPromise(sitemapStream);
    }

    async submitSitemap(hostname) {
        try {
            await axios.get(
                `https://google.com/ping?sitemap=${hostname}/sitemap.xml`
            );
            return "Sitemap submitted";
        } catch (e) {
            const message =
                "Error while submitting sitemap to search engine: " + e.message;
            this.logger.error(message);
            return message;
        }
    }
}
