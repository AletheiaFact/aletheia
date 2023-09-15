import { Injectable } from "@nestjs/common";
import { Novu, TriggerRecipientsTypeEnum } from "@novu/node";
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

    async sendEmail(subscriberId: string, email: string) {
        const result = await this.novu.trigger("email-sender", {
            to: {
                subscriberId: subscriberId,
                email: email,
            },
            payload: {},
        });

        return result.data;
    }

    async sendNotification(subscriberId: string, description: string) {
        const result = await this.novu.trigger("email-notifications", {
            to: {
                subscriberId: subscriberId,
            },
            payload: {
                messageIdentifier: description,
            },
        });

        return result.data;
    }

    async createTopic(key: string, name: string) {
        const result = await this.novu.topics.create({
            key,
            name,
        });

        return result.data;
    }

    async addTopicSubscriber(key: string, subscriberId: string) {
        const result = await this.novu.topics.addSubscribers(key, {
            subscribers: [subscriberId],
        });

        return result.data;
    }

    async sendTopicNotification(key: string, description: string) {
        //TODO: Rename trigger name based on dashboard
        const result = await this.novu.trigger("email-quickstart", {
            to: [{ type: TriggerRecipientsTypeEnum.TOPIC, topicKey: key }],
            payload: { description },
        });

        return result.data;
    }
}
