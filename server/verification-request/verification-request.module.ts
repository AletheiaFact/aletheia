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
import { CallbackRoute } from "../ai-task/constants/ai-task.constants";
import { AbilityModule } from "../auth/ability/ability.module";
import { TopicModule } from "../topic/topic.module";
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
        TopicModule,
        HistoryModule,
        GroupModule,
        CaptchaModule,
        AiTaskModule,
        CallbackDispatcherModule,
        AbilityModule,
    ],
    exports: [
        VerificationRequestService,
        VerificationRequestStateMachineService,
    ],
    providers: [
        VerificationRequestService,
        VerificationRequestStateMachineService,
    ],
    controllers: [VerificationRequestController],
})
export class VerificationRequestModule implements OnModuleInit {
    constructor(
        private readonly dispatcher: CallbackDispatcherService,
        private readonly verificationService: VerificationRequestService
    ) {}

    onModuleInit() {
        // Register callback for embedding updates
        this.dispatcher.register(
            CallbackRoute.VERIFICATION_UPDATE_EMBEDDING,
            (params, result) => {
                console.log(`[VerificationRequestModule] EMBEDDING callback invoked with params:`, params);
                return this.verificationService.updateFieldByAiTask(params, result);
            }
        );

        // Register callback for identifying data updates (legacy, kept for compatibility)
        this.dispatcher.register(
            CallbackRoute.VERIFICATION_UPDATE_IDENTIFYING_DATA,
            (params, result) => {
                console.log(`[VerificationRequestModule] IDENTIFYING_DATA callback invoked with params:`, params);
                return this.verificationService.updateFieldByAiTask(params, result);
            }
        );

        // Register callback for topics updates
        this.dispatcher.register(
            CallbackRoute.VERIFICATION_UPDATE_TOPICS,
            (params, result) => {
                console.log(`[VerificationRequestModule] TOPICS callback invoked with params:`, params);
                return this.verificationService.updateFieldByAiTask(params, result);
            }
        );

        // Register callback for impact area updates
        this.dispatcher.register(
            CallbackRoute.VERIFICATION_UPDATE_IMPACT_AREA,
            (params, result) => {
                console.log(`[VerificationRequestModule] IMPACT_AREA callback invoked with params:`, params);
                return this.verificationService.updateFieldByAiTask(params, result);
            }
        );

        // Register callback for severity updates
        this.dispatcher.register(
            CallbackRoute.VERIFICATION_UPDATE_SEVERITY,
            (params, result) => {
                console.log(`[VerificationRequestModule] SEVERITY callback invoked with params:`, params);
                return this.verificationService.updateFieldByAiTask(params, result);
            }
        );
    }
}
