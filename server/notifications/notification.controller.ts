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
            description: string;
        }
    ) {
        return this.notificationService.sendEmail(
            body.subscriberId,
            body.email,
            body.description
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
}
