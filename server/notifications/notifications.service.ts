import { Injectable, Logger } from "@nestjs/common";
import { Novu, TriggerRecipientsTypeEnum } from "@novu/node";
import { InjectNovu } from "./novu.provider";
import { createHmac } from "crypto";
import { ConfigService } from "@nestjs/config";
@Injectable()
export class NotificationService {
    private readonly logger = new Logger("NotificationService");
    
    constructor(
        @InjectNovu()
        private readonly novu: Novu | null,
        private configService: ConfigService
    ) {
        if (!this.novu) {
            this.logger.warn("Novu is not configured - notifications will be disabled");
        }
    }

    novuIsConfigured(): boolean {
        // Check both API key and Novu instance
        if (this.novu && this.configService.get<string>("novu.api_key")) return true;
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

    async getTopic(key: string) {
        if (!this.novuIsConfigured()) {
            return;
        }

        try {
            const result = await this.novu.topics.get(key);
            return result.data;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    async addTopicSubscriber(key: string, subscribersId) {
        if (!this.novuIsConfigured()) {
            return;
        }

        const result = await this.novu.topics.addSubscribers(key, {
            subscribers: subscribersId,
        });

        return result.data;
    }

    async removeTopicSubscriber(key: string, subscribersId) {
        if (!this.novuIsConfigured()) {
            return;
        }

        const result = await this.novu.topics.removeSubscribers(key, {
            subscribers: subscribersId,
        });

        return result.data;
    }

    async sendDailyReviewsEmail(key: string, body) {
        if (!this.novuIsConfigured()) {
            return;
        }

        const result = await this.novu.trigger("daily-report", {
            to: [{ type: TriggerRecipientsTypeEnum.TOPIC, topicKey: key }],
            payload: {
                body: body,
            },
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
