import { Inject, Injectable, Logger, Optional } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { IClaimService } from "../../interfaces/claim.service.interface";
import { NotificationService } from "../../notifications/notifications.service";
import * as notificationMessages from "../../../public/locales/pt/notification.json";

export type ReviewNotificationKey = keyof typeof notificationMessages;

// Sentence page path, as src/utils/GetSentenceContentHref.ts builds it for
// speeches (the only content the MCP queue creates). Imported logic from
// src/ would pull frontend modules into the server build.
function sentencePath(nameSpace: string, claim: any, dataHash: string) {
    const base = nameSpace !== "main" ? `/${nameSpace}` : "";
    const personality = claim?.personalities?.[0];
    const claimPath = personality?.slug
        ? `/personality/${personality.slug}/claim/${claim?.slug}`
        : `/claim/${claim?.slug}`;
    return `${base}${claimPath}/sentence/${dataHash}`;
}

/**
 * Server-side counterpart of src/notifications/sendReviewNotifications.ts
 * for MCP transitions (the web app sends them from the browser).
 * Best-effort: never fails the transition.
 */
@Injectable()
export class ReviewNotifierService {
    private readonly logger = new Logger(ReviewNotifierService.name);

    constructor(
        @Inject("ClaimService") private readonly claimService: IClaimService,
        @Optional() private readonly configService?: ConfigService,
        @Optional() private readonly notificationService?: NotificationService
    ) {}

    notify(
        task: any,
        messageKey: ReviewNotificationKey,
        recipients: unknown[]
    ) {
        const notificationService = this.notificationService;
        if (!notificationService || !recipients.length) return;
        void (async () => {
            const claim: any = await this.claimService.getById(
                task.target.toString(),
                task.nameSpace
            );
            const baseUrl = this.configService?.get<string>("baseUrl") ?? "";
            const payload = {
                messageIdentifier: notificationMessages[messageKey],
                redirectUrl: `${baseUrl}${sentencePath(
                    task.nameSpace,
                    claim,
                    task.data_hash
                )}`,
            };
            await Promise.all(
                recipients.map((id) =>
                    notificationService.sendNotification(String(id), payload)
                )
            );
        })().catch((error) =>
            this.logger.error(
                `Notification "${messageKey}" for ${task.data_hash} failed: ${error}`
            )
        );
    }
}
