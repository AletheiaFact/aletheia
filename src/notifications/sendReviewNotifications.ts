import NotificationsApi from "../api/notificationsApi";
import { ReviewTaskEvents as Events } from "../machines/reviewTask/enums";

// DEPRECATED: This function will be removed in favor of server-side notifications
// Notifications should be handled on the backend when state changes occur
const sendReviewNotifications = (
    data_hash,
    event,
    reviewData,
    currentUserId,
    t
) => {
    // TODO: Remove this function completely once server-side notifications are implemented
    console.warn("sendReviewNotifications is deprecated. Notifications should be handled server-side.");
    return;

    const payload = {
        messageIdentifier: "",
        redirectUrl: window.location.href.includes("/sentence")
            ? window.location.href
            : `${window.location.href}/sentence/${data_hash}`,
    };

    if (event === Events.assignUser) {
        payload.messageIdentifier = t("notification:assignedUser");
        for (const user of reviewData.usersId) {
            NotificationsApi.sendNotification(user, payload);
        }
    }

    if (event === Events.finishReport) {
        payload.messageIdentifier = t("notification:reviewProgress");
        const inactiveUsers = reviewData.usersId.filter(
            (userId) => userId !== currentUserId
        );

        for (const user of inactiveUsers) {
            NotificationsApi.sendNotification(user, payload);
        }
    }

    if (event === Events.sendToCrossChecking) {
        payload.messageIdentifier = t("notification:crossCheckingSubmit");
        const inactiveUsers = reviewData.usersId.filter(
            (userId) => userId !== currentUserId
        );

        for (const user of inactiveUsers) {
            NotificationsApi.sendNotification(user, payload);
        }

        if (reviewData.crossCheckerId) {
            payload.messageIdentifier = t("notification:crossChecker");
            NotificationsApi.sendNotification(
                reviewData.crossCheckerId,
                payload
            );
        }
    }

    if (event === Events.sendToReview) {
        payload.messageIdentifier = t("notification:reviewSubmit");
        const inactiveUsers = reviewData.usersId.filter(
            (userId) => userId !== currentUserId
        );

        for (const user of inactiveUsers) {
            NotificationsApi.sendNotification(user, payload);
        }

        if (reviewData.reviewerId) {
            payload.messageIdentifier = t("notification:reviewer");
            NotificationsApi.sendNotification(reviewData.reviewerId, payload);
        }
    }

    if (event === Events.addRejectionComment) {
        payload.messageIdentifier = t("notification:reviewRejected");
        for (const user of reviewData.usersId) {
            NotificationsApi.sendNotification(user, payload);
        }
    }

    if (event === Events.publish) {
        payload.messageIdentifier = t("notification:reviewPublished");
        for (const user of reviewData.usersId) {
            NotificationsApi.sendNotification(user, payload);
        }
    }
};

export default sendReviewNotifications;
