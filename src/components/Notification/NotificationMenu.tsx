import React, { useEffect, useState } from "react";
import {
    INotificationCenterStyles,
    NovuProvider,
    PopoverNotificationCenter,
} from "@novu/notification-center";
import NotificationCard from "../Notification/NotificationCard";
import { Empty } from "antd";
import Cookies from "js-cookie";
import NotificationIcon from "./NotificationIcon";
import NotificationsApi from "../../api/notificationsApi";

const notificationStyles: INotificationCenterStyles = {
    popover: {
        dropdown: {
            "& > div": {
                width: "100%",
                maxWidth: "380px",
                "@media (max-width: 460px)": {
                    marginLeft: "10px",
                    maxWidth: "320px",
                },
            },
            ".nc-header": {
                gap: "32px",
            },
        },
        arrow: {
            marginRight: "18px",
            "@media (max-width: 405px)": {
                marginRight: "calc(100% - 75vw)",
            },
        },
    },
};

const NotificationMenu = ({ hasSession, user }) => {
    const language = Cookies.get("default_language") || "pt";
    const [applicationIdentifier, setApplicationIdentifier] = useState(null);
    const [hmacHash, setHmacHash] = useState(null);

    useEffect(() => {
        NotificationsApi.getTokens(user?._id).then(
            (data: { applicationIdentifier: string; hmacHash: string }) => {
                setApplicationIdentifier(data?.applicationIdentifier);
                setHmacHash(data?.hmacHash);
            }
        );
    }, [user?._id]);

    if (hmacHash && applicationIdentifier && hasSession) {
        return (
            <NovuProvider
                subscriberId={user?._id}
                subscriberHash={hmacHash}
                applicationIdentifier={applicationIdentifier}
                initialFetchingStrategy={{
                    fetchNotifications: true,
                    fetchUserPreferences: true,
                }}
                styles={notificationStyles}
                i18n={language}
            >
                <PopoverNotificationCenter
                    showUserPreferences={false}
                    colorScheme="light"
                    position="top-end"
                    offset={10}
                    listItem={(
                        notification,
                        handleActionClick,
                        handleNotificationClick
                    ) => (
                        <NotificationCard
                            notification={notification}
                            handleNotificationClick={handleNotificationClick}
                        />
                    )}
                    footer={() => <></>}
                    emptyState={
                        <Empty
                            style={{ marginTop: "100px" }}
                            description={false}
                        />
                    }
                >
                    {({ unseenCount }) => (
                        <NotificationIcon unseenCount={unseenCount} />
                    )}
                </PopoverNotificationCenter>
            </NovuProvider>
        );
    } else {
        return <></>;
    }
};

export default NotificationMenu;
