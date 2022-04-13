import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ClaimRevision, ClaimRevisionSchema } from "./schema/claim-revision.schema";
import { ParserModule } from "../parser/parser.module";
import { ConfigModule } from "@nestjs/config";
import { HttpModule } from "@nestjs/axios";
import { ViewModule } from "../view/view.module";
import { SourceModule } from "../source/source.module";
import { ClaimRevisionService } from "./claim-revision.service";

const ClaimRevisionModel = MongooseModule.forFeature([
    {
        name: ClaimRevision.name,
        schema: ClaimRevisionSchema,
    },
]);

@Module({
    // TODO: clean-up Claim module after logic is fully migrated to ClaimRevision
    imports: [
        ClaimRevisionModel,
        ParserModule,
        ConfigModule,
        HttpModule,
        ViewModule,
        SourceModule,
    ],
    exports: [ClaimRevisionService],
    providers: [ClaimRevisionService],
})
export class ClaimRevisionModule {}