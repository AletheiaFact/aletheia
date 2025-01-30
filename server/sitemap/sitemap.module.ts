import { Module } from "@nestjs/common";
import { SitemapController } from "./sitemap.controller";
import { PersonalityModule } from "../personality/personality.module";
import { ClaimModule } from "../claim/claim.module";
import { ClaimReviewModule } from "../claim-review/claim-review.module";
import { SitemapService } from "./sitemap.service";

@Module({
    imports: [PersonalityModule.register(), ClaimModule, ClaimReviewModule],
    controllers: [SitemapController],
    providers: [SitemapService],
    exports: [SitemapService],
})
export class SitemapModule {}
