import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { SitemapController } from "./sitemap.controller";
import { PersonalityModule } from "../personality/personality.module";
import { ClaimModule } from "../claim/claim.module";
import { ClaimReviewModule } from "../claim-review/claim-review.module";
import { SitemapService } from "./sitemap.service";

@Module({
    imports: [
        ConfigModule,
        PersonalityModule.register(),
        ClaimModule.register(),
        ClaimReviewModule,
    ],
    controllers: [SitemapController],
    providers: [SitemapService],
    exports: [SitemapService],
})
export class SitemapModule {}
