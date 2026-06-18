import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import sendReviewNotifications from "./sendReviewNotifications";
import NotificationsApi from "../api/notificationsApi";
import { ReviewTaskEvents } from "../machines/reviewTask/enums";
import { ContentModelEnum } from "../types/enums";
import { NameSpaceEnum } from "../types/Namespace";

vi.mock("../api/notificationsApi", () => ({
    default: { sendNotification: vi.fn() },
}));

const t = ((key: string) => key) as any;

const baseArgs = {
    data_hash: "abc123",
    event: ReviewTaskEvents.assignUser,
    reviewData: { usersId: ["u1"] },
    claim: { slug: "claim-slug", contentModel: ContentModelEnum.Speech } as any,
    personality: { slug: "person-slug" } as any,
    nameSpace: NameSpaceEnum.Main,
    currentUserId: "me",
    t,
};

describe("sendReviewNotifications redirectUrl", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        // @ts-ignore
        delete globalThis.window;
    });

    it("prepends window.location.origin when running in browser", () => {
        // @ts-ignore
        globalThis.window = {
            location: { origin: "https://app.aletheiafact.org" },
        };

        sendReviewNotifications(baseArgs);

        expect(NotificationsApi.sendNotification).toHaveBeenCalledWith("u1", {
            messageIdentifier: "notification:assignedUser",
            redirectUrl:
                "https://app.aletheiafact.org/personality/person-slug/claim/claim-slug/sentence/abc123",
        });
    });

    it("falls back to path-only when window is undefined (SSR)", () => {
        sendReviewNotifications(baseArgs);

        expect(NotificationsApi.sendNotification).toHaveBeenCalledWith("u1", {
            messageIdentifier: "notification:assignedUser",
            redirectUrl:
                "/personality/person-slug/claim/claim-slug/sentence/abc123",
        });
    });

    it("falls back to path-only when window.location.origin is empty", () => {
        // @ts-ignore
        globalThis.window = { location: { origin: "" } };

        sendReviewNotifications(baseArgs);

        const call = (NotificationsApi.sendNotification as any).mock.calls[0];
        expect(call[1].redirectUrl).toBe(
            "/personality/person-slug/claim/claim-slug/sentence/abc123"
        );
        expect(call[1].redirectUrl.startsWith("http:///")).toBe(false);
    });
});
