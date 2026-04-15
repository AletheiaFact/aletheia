import NotificationsApi from "../api/notificationsApi";
import { ReviewTaskEvents as Events } from "../machines/reviewTask/enums";
import { generateSentenceContentPath } from "../utils/GetSentenceContentHref";

const sendReviewNotifications = (
    data_hash,
    event,
    reviewData,
    claim,
    personality,
    nameSpace,
    currentUserId,
    t
) => {

    const currentPath = generateSentenceContentPath(
        nameSpace,
        personality,
        claim,
        claim?.contentModel,
        data_hash
    );

    const payload = {
        messageIdentifier: "",
        redirectUrl: currentPath
    };

    if (event === Events.assignUser) {
        payload.messageIdentifier = t("notification:assignedUser");
        for (const user of reviewData.usersId) {
            NotificationsApi.sendNotification(user, payload);
        }
    }

    if (event === Events.reAssignUser) {
        payload.messageIdentifier = t("notification:reAssignedUser");
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

    if (event === Events.submitCrossChecking) {
        payload.messageIdentifier = t("notification:crossCheckingFinished");
        const inactiveUsers = reviewData.usersId.filter(
            (userId) => userId !== currentUserId
        );

        for (const user of inactiveUsers) {
            NotificationsApi.sendNotification(user, payload);
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

    if (event === Events.submitComment) {
        payload.messageIdentifier = t("notification:newComment");
        const inactiveUsers = reviewData.usersId.filter(
            (userId) => userId !== currentUserId
        );

        for (const user of inactiveUsers) {
            NotificationsApi.sendNotification(user, payload);
        }
    }

    if (event === Events.reject) {
        payload.messageIdentifier = t("notification:reviewRejectRequested");
        const inactiveUsers = reviewData.usersId.filter(
            (userId) => userId !== currentUserId
        );

        for (const user of inactiveUsers) {
            NotificationsApi.sendNotification(user, payload);
        }
    }

    if (event === Events.confirmRejection) {
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
