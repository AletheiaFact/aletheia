import { Body, Controller, Param, Post } from "@nestjs/common";
import { NotificationService } from "./notifications.service";
import { ApiTags } from "@nestjs/swagger";

@Controller()
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) {}

    @ApiTags("notifications")
    @Post("api/emails")
    sendEmail(
        @Body()
        body: {
            subscriberId: string;
            email: string;
        }
    ) {
        return this.notificationService.sendEmail(
            body.subscriberId,
            body.email
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

    @Post("api/topic-subscription/:key/send")
    sendTopicNotification(
        @Param("key") key: string,
        @Body("description") description: string
    ) {
        return this.notificationService.sendTopicNotification(key, description);
    }
}
