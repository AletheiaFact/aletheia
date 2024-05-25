import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { NotificationService } from "./notifications.service";
import { ApiTags } from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";
import { SummarizationService } from "../summarization/summarization.service";
import {
    AdminUserAbility,
    CheckAbilities,
} from "../auth/ability/ability.decorator";
import { AbilitiesGuard } from "../auth/ability/abilities.guard";

@Controller()
export class NotificationController {
    constructor(
        private readonly notificationService: NotificationService,
        private summarizationService: SummarizationService,
        private configService: ConfigService
    ) {}

    @Post("api/topic-subscription/:key/send")
    @UseGuards(AbilitiesGuard)
    @CheckAbilities(new AdminUserAbility())
    async sendDailyReport(
        @Body()
        body: {
            key: string;
        }
    ) {
        const dailyReport =
            await this.summarizationService.generateDailyReport();

        return this.notificationService.sendDailyReviewsEmail(
            body.key,
            dailyReport
        );
    }

    @ApiTags("notifications")
    @Post("api/notification")
    sendNotification(@Body() body) {
        const { subscriberId, payload } = body;
        return this.notificationService.sendNotification(subscriberId, payload);
    }

    @Post("api/topic-subscription")
    createTopic(@Body() body: { key: string; name: string }) {
        return this.notificationService.createTopic(body.key, body.name);
    }

    @Post("api/topic-subscription/:key/subscribers")
    addSubscriberToTopic(
        @Param("key") key: string,
        @Body("subscriberId") subscriberId: string
    ) {
        return this.notificationService.addTopicSubscriber(key, subscriberId);
    }

    @Get("api/notification/token/:subscriberId")
    async getTokens(@Param("subscriberId") subscriberId) {
        const hmacHash =
            this.notificationService.generateHmacHash(subscriberId);
        const applicationIdentifier = this.configService.get<string>(
            "novu.application_identifier"
        );

        return {
            hmacHash,
            applicationIdentifier,
        };
    }
}
