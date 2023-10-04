import NotificationsApi from "../api/notificationsApi";
import { ReviewTaskEvents as Events } from "../machines/reviewTask/enums";

const sendReviewNotifications = (
    data_hash,
    event,
    reviewData,
    currentUserId,
    t
) => {
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

    if (
        event === Events.finishReport ||
        event === Events.fullReview ||
        event === Events.partialReview
    ) {
        payload.messageIdentifier = t("notification:reviewProgress");
        const inactiveUsers = reviewData.usersId.filter(
            (userId) => userId !== currentUserId
        );

        for (const user of inactiveUsers) {
            NotificationsApi.sendNotification(user, payload);
        }
    }

    if (event === Events.submit) {
        payload.messageIdentifier = t("notification:reviewSubmit");
        const inactiveUsers = reviewData.usersId.filter(
            (userId) => userId !== currentUserId
        );

        for (const user of inactiveUsers) {
            NotificationsApi.sendNotification(user, payload);
        }

        if (reviewData.reviewerId) {
            payload.messageIdentifier = t("notification:reviewerCrossChecking");
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
