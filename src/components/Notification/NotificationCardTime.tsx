import { useTranslations } from "next-intl";
import React from "react";

const NotificationCardTime = ({ createdAt }) => {
    const tNotification = useTranslations("notification");

    const getNotificationTime = () => {
        const createdAtDate = new Date(createdAt);
        const currentDate = new Date();
        const timeDifference = Number(currentDate) - Number(createdAtDate);
        const minutesDifference = Math.floor(timeDifference / 1000 / 60);
        const hoursDifference = Math.floor(timeDifference / 1000 / 60 / 60);

        if (hoursDifference === 0) {
            if (minutesDifference === 0) {
                return tNotification("timeNow");
            }

            return `${minutesDifference}m`;
        }
        if (hoursDifference > 24) {
            return `${Math.floor(hoursDifference / 24)}d`;
        }
        return `${hoursDifference}h`;
    };

    return <span className="notification-time">{getNotificationTime()}</span>;
};

export default NotificationCardTime;
