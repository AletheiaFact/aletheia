import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule } from "@nestjs/config";
import { AiTaskName, AiTaskSchema } from "./schemas/ai-task.schema";
import { AiTaskService } from "./ai-task.service";
import { AiTaskController } from "./ai-task.controller";
import { CallbackDispatcherModule } from "../callback-dispatcher/callback-dispatcher.module";
import { AbilityModule } from "../auth/ability/ability.module";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: AiTaskName, schema: AiTaskSchema }]),
        CallbackDispatcherModule,
        AbilityModule,
        ConfigModule,
    ],
    providers: [AiTaskService],
    controllers: [AiTaskController],
    exports: [AiTaskService],
})
export class AiTaskModule {}
