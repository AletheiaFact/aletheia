import { Module, OnModuleInit } from "@nestjs/common";
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
import { AiTaskModule } from "../ai-task/ai-task.module";
import { CallbackDispatcherService } from "../callback-dispatcher/callback-dispatcher.service";
import { CallbackDispatcherModule } from "../callback-dispatcher/callback-dispatcher.module";

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
        AiTaskModule,
        CallbackDispatcherModule,
    ],
    exports: [VerificationRequestService],
    providers: [VerificationRequestService],
    controllers: [VerificationRequestController],
})
export class VerificationRequestModule implements OnModuleInit {
    constructor(
        private readonly dispatcher: CallbackDispatcherService,
        private readonly verificationService: VerificationRequestService
    ) {}

    onModuleInit() {
        this.dispatcher.register(
            "verification.updateEmbedding",
            (params, result) =>
                this.verificationService.updateEmbedding(params, result)
        );
    }
}
