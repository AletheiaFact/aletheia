import { useTranslation } from "next-i18next";
import React from "react";

const NotificationCardTime = ({ createdAt }) => {
    const { t } = useTranslation();

    const getNotificationTime = () => {
        const createdAtDate = new Date(createdAt);
        const currentDate = new Date();
        const timeDifference = Number(currentDate) - Number(createdAtDate);
        const minutesDifference = Math.floor(timeDifference / 1000 / 60);
        const hoursDifference = Math.floor(timeDifference / 1000 / 60 / 60);

        if (hoursDifference === 0) {
            if (minutesDifference === 0) {
                return t("notification:timeNow");
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
