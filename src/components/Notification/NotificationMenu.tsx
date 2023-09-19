import React from "react";
import {
    NovuProvider,
    PopoverNotificationCenter,
} from "@novu/notification-center";
import NotificationCard from "../Notification/NotificationCard";
import { Empty } from "antd";
import Cookies from "js-cookie";
import NotificationIcon from "./NotificationIcon";

const NotificationMenu = ({ user }) => {
    const language = Cookies.get("default_language") || "pt";

    if (user?._id) {
        return (
            <NovuProvider
                subscriberId={user?._id}
                i18n={language}
                applicationIdentifier={"jElaPejsNYRF"}
                initialFetchingStrategy={{
                    fetchNotifications: true,
                    fetchUserPreferences: true,
                }}
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
