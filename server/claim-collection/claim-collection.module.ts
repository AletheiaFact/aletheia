import { Module } from "@nestjs/common";
import { ClaimCollectionService } from "./claim-collection.service";
import { MongooseModule } from "@nestjs/mongoose";
import { ClaimCollectionController } from "./claim-collection.controller";
import { CaptchaModule } from "../captcha/captcha.module";
import { ViewModule } from "../view/view.module";
import { HistoryModule } from "../history/history.module";
import {
    ClaimCollection,
    ClaimCollectionSchema,
} from "./schemas/claim-collection.schema";

export const ClaimCollectionModel = MongooseModule.forFeature([
    {
        name: ClaimCollection.name,
        schema: ClaimCollectionSchema,
    },
]);

@Module({
    imports: [ClaimCollectionModel, HistoryModule, CaptchaModule, ViewModule],
    providers: [ClaimCollectionService],
    exports: [ClaimCollectionService],
    controllers: [ClaimCollectionController],
})
export class ClaimCollectionModule {}
