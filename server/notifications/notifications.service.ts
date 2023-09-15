import { Injectable } from "@nestjs/common";
import { Novu } from "@novu/node";
import { InjectNovu } from "./novu.provider";

@Injectable()
export class NotificationService {
    constructor(
        @InjectNovu()
        private readonly novu: Novu
    ) {}

    createSubscription({ email, name }) {
        this.novu.trigger("email-sender", {
            to: {
                subscriberId: email,
                email: email,
                firstName: name,
            },
            payload: {},
        });
    }

    async sendEmail(subscriberId: string, email: string, description: string) {
        const result = await this.novu.trigger("email-sender", {
            to: {
                subscriberId,
                email,
            },
            payload: {
                email,
                description,
            },
        });

        return result.data;
    }

    async sendNotification(subscriberId: string, message: string) {
        const result = await this.novu.trigger("email-notifications", {
            to: {
                subscriberId,
            },
            payload: {
                message,
            },
        });

        return result.data;
    }
}
