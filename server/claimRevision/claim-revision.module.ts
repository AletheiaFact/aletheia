import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ClaimRevision, ClaimRevisionSchema } from "./schema/claim-revision.schema";
// import { ClaimService } from "./claim.service";
import { ClaimRevisionController } from "./claim-revision.controller"
// import { ClaimReviewModule } from "../claim-review/claim-review.module";
import { ParserModule } from "../parser/parser.module";
import { PersonalityModule } from "../personality/personality.module";
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
    imports: [
        ClaimRevisionModel,
        ParserModule,
        PersonalityModule,
        ConfigModule,
        HttpModule,
        ViewModule,
        SourceModule,
    ],
    exports: [ClaimRevisionService],
    providers: [ClaimRevisionService],
    controllers: [ClaimRevisionController],
})
export class ClaimRevisionModule {}

//campo novo revision:id auto increment
//nova versão uptade, ao atualizar uma afirmação. Ḿanterá a antiga, porém irá criar
//outra com as alterações
//Claim revision irá se basear na Claim, porém apenas com os dados necessários e um novo ID,
//que seria seu ID de revisão. Sempre que essa mesma claim for alterada ela obterá um novo ID de revisão
//A claimRevision terá o claim-id que é o mesmo id da Claim que se referencia, e o revision-id
//Fazer um module, criar um controller com get e post para realizar o teste
