import { Injectable } from "@nestjs/common";
import { Novu, TriggerRecipientsTypeEnum } from "@novu/node";
import { InjectNovu } from "./novu.provider";
import { createHmac } from "crypto";
import { ConfigService } from "@nestjs/config";
@Injectable()
export class NotificationService {
    constructor(
        @InjectNovu()
        private readonly novu: Novu,
        private configService: ConfigService
    ) {}

    novuIsConfigured(): boolean {
        if (this.configService.get<string>("novu.api_key")) return true;
        return false;
    }

    async createSubscriber({ _id = null, email, name }) {
        if (!this.novuIsConfigured()) {
            return;
        }

        const result = await this.novu.subscribers.identify(_id, {
            email,
            firstName: name,
        });
        this.novu.trigger("email-sender", {
            to: {
                subscriberId: _id,
                email,
                firstName: name,
            },
            payload: {},
        });

        return result.data;
    }

    async sendEmail(subscriberId: string, email: string) {
        if (!this.novuIsConfigured()) {
            return;
        }

        const result = await this.novu.trigger("email-sender", {
            to: {
                subscriberId,
                email,
            },
            payload: {},
        });

        return result.data;
    }

    async sendNotification(subscriberId: string, payload: any) {
        if (!this.novuIsConfigured()) {
            return;
        }

        const result = await this.novu.trigger("email-notifications", {
            to: {
                subscriberId,
            },
            payload,
        });

        return result.data;
    }

    async createTopic(key: string, name: string) {
        if (!this.novuIsConfigured()) {
            return;
        }

        const result = await this.novu.topics.create({
            key,
            name,
        });

        return result.data;
    }

    async addTopicSubscriber(key: string, subscriberId: string) {
        if (!this.novuIsConfigured()) {
            return;
        }

        const result = await this.novu.topics.addSubscribers(key, {
            subscribers: [subscriberId],
        });

        return result.data;
    }

    async removeTopicSubscriber(key: string, subscriberId: string) {
        if (!this.novuIsConfigured()) {
            return;
        }

        const result = await this.novu.topics.removeSubscribers(key, {
            subscribers: [subscriberId],
        });

        return result.data;
    }

    async sendTopicNotification(key: string, description: string) {
        if (!this.novuIsConfigured()) {
            return;
        }

        //TODO: Rename trigger name based on dashboard
        const result = await this.novu.trigger("email-quickstart", {
            to: [{ type: TriggerRecipientsTypeEnum.TOPIC, topicKey: key }],
            payload: { description },
        });

        return result.data;
    }

    async verifyUserOnTopic(key: string, externalSubscriberId: string) {
        if (!this.novuIsConfigured()) {
            return;
        }

        const result = await this.novu.topics.getSubscriber(
            key,
            externalSubscriberId
        );

        return result.data;
    }

    generateHmacHash(subscriberId) {
        if (!this.novuIsConfigured()) {
            return;
        }

        const NOVU_API_KEY = this.configService.get<string>("novu.api_key");

        return createHmac("sha256", NOVU_API_KEY)
            .update(subscriberId)
            .digest("hex");
    }
}