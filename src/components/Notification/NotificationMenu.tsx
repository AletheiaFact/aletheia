import React, { useEffect, useState } from "react";
import {
    INotificationCenterStyles,
    NovuProvider,
    PopoverNotificationCenter,
} from "@novu/notification-center";
import NotificationCard from "../Notification/NotificationCard";
import Cookies from "js-cookie";
import NotificationIcon from "./NotificationIcon";
import NotificationsApi from "../../api/notificationsApi";
import { SvgIcon } from "@mui/material";
import { NotificationsOff } from "@mui/icons-material";
import { useTranslation } from "next-i18next";
import colors from "../../styles/colors";

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
    const { t } = useTranslation();

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
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                marginTop: "100px",
                            }}
                        >
                            <SvgIcon
                                component={NotificationsOff}
                                sx={{ fontSize: 50, color: colors.neutralSecondary }}
                            />
                            <p
                                style={{
                                    color: colors.neutralSecondary,
                                    marginTop: "16px"
                                }}
                            >
                                {t("notification:noNotification")}
                            </p>
                        </div>
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
