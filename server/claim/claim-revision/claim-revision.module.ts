import { DynamicModule, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import {
    ClaimRevision,
    ClaimRevisionSchema,
} from "./mongo/schemas/claim-revision.schema";
import { ParserModule } from "../parser/parser.module";
import { ConfigModule } from "@nestjs/config";
import { HttpModule } from "@nestjs/axios";
import { ViewModule } from "../../view/view.module";
import { SourceModule } from "../../source/source.module";
import { MongoClaimRevisionService } from "./mongo/claim-revision.service";
import { PostgresClaimRevisionService } from "./postgres/claim-revision.service";
import { claimRevisionServiceProvider } from "./claim-revision.provider";
import { ParagraphModule } from "../types/paragraph/paragraph.module";
import { SpeechModule } from "../types/speech/speech.module";
import { ImageModule } from "../types/image/image.module";
import { DebateModule } from "../types/debate/debate.module";
import { ClaimRevisionController } from "./claim-revision.controller";
import { UtilService } from "../../util";
import dbConfig from "../../config/db.config";

const ClaimRevisionModel = MongooseModule.forFeature([
    {
        name: ClaimRevision.name,
        schema: ClaimRevisionSchema,
    },
]);

@Module({})
export class ClaimRevisionModule {
    static register(): DynamicModule {
        const imports: any[] = [];
        const providers: any[] = [claimRevisionServiceProvider, UtilService];

        if (dbConfig.type === "mongodb") {
            imports.push(ClaimRevisionModel);
            providers.push(MongoClaimRevisionService);
        } else if (dbConfig.type === "postgres") {
            providers.push(PostgresClaimRevisionService);
        } else {
            throw new Error("Invalid DB_TYPE in configuration");
        }

        return {
            module: ClaimRevisionModule,
            imports: [
                ...imports,
                ParserModule,
                ParagraphModule.register(),
                SpeechModule.register(),
                ImageModule,
                DebateModule,
                ConfigModule,
                HttpModule,
                ViewModule,
                SourceModule.register(),
            ],
            controllers: [ClaimRevisionController],
            exports: ["ClaimRevisionService"],
            providers,
        };
    }
}
