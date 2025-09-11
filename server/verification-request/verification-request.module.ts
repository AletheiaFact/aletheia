import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import {
    VerificationRequestSchema,
    VerificationRequest,
} from "./schemas/verification-request.schema";
import { VerificationRequestService } from "./verification-request.service";
import { VerificationRequestController } from "./verification-request.controller";
import { SourceModule } from "../source/source.module";
import { ViewModule } from "../view/view.module";
import { ConfigModule } from "@nestjs/config";
import { ReviewTaskModule } from "../review-task/review-task.module";
import { HistoryModule } from "../history/history.module";
import { GroupModule } from "../group/group.module";
import { CaptchaModule } from "../captcha/captcha.module";
import { VerificationRequestStateMachineService } from "./state-machine/verification-request.state-machine.service";

const VerificationRequestModel = MongooseModule.forFeature([
    {
        name: VerificationRequest.name,
        schema: VerificationRequestSchema,
    },
]);

@Module({
    imports: [
        VerificationRequestModel,
        SourceModule,
        ViewModule,
        ConfigModule,
        ReviewTaskModule,
        HistoryModule,
        GroupModule,
        CaptchaModule,
    ],
    exports: [VerificationRequestService, VerificationRequestStateMachineService],
    providers: [VerificationRequestService, VerificationRequestStateMachineService],
    controllers: [VerificationRequestController],
})
export class VerificationRequestModule {}
