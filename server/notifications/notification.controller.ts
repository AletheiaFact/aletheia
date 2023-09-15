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
    sendNotification(
        @Body() body: { subscriberId: string; description: string }
    ) {
        return this.notificationService.sendNotification(
            body.subscriberId,
            body.description
        );
    }

    @Post("topics")
    createTopic(@Body() body: { key: string; name: string }) {
        return this.notificationService.createTopic(body.key, body.name);
    }

    @Post("topics/:key/subscribers")
    addSubscriberToTopic(
        @Param("key") key: string,
        @Body("subscriberId") subscriberId: string
    ) {
        return this.notificationService.addTopicSubscriber(key, subscriberId);
    }

    @Post("topics/:key/send")
    sendTopicNotification(
        @Param("key") key: string,
        @Body("description") description: string
    ) {
        return this.notificationService.sendTopicNotification(key, description);
    }
}
