import React, { useState } from "react";
import { CircularProgress, Badge } from "@mui/material";
import { DraftsOutlined, MailOutlineOutlined } from "@mui/icons-material";
import NotificationCardActions from "./NotificationCardActions";
import NotificationCardTime from "./NotificationCardTime";
import NotificationCardStyle from "./NotificationCard.style";
import { useAtom } from "jotai";
import { currentNameSpace } from "../../atoms/namespace";

const NotificationCard = ({ notification, handleNotificationClick }) => {
    const { seen, createdAt, payload } = notification;
    const [nameSpace] = useAtom(currentNameSpace);
    const [isSeen, setIsSeen] = useState<boolean>(seen);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleContainerClick = async () => {
        if (!isSeen) {
            await handleNotificationClick();
            setIsSeen(true);
        }
        if (payload.redirectUrl) {
            setIsLoading(true);
            window.location = payload.redirectUrl;
        }
    };

    return (
        isLoading ? (
            <CircularProgress
                size={48}
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    marginLeft: "-24px",
                    marginTop: "-24px",
                }}
            />
        ) : (
            <NotificationCardStyle isSeen={isSeen} namespace={nameSpace}>
                <div className="container" onClick={handleContainerClick}>
                    <div className="notification-avatar">
                        {!isSeen && (
                            <Badge
                                overlap="circular"
                                variant="dot"
                                color="secondary"
                                sx={{ marginRight: 2 }}
                            />
                        )}

                        {!isSeen ? (
                            <MailOutlineOutlined className="notification-avatar-icon" />
                        ) : (
                            <DraftsOutlined className="notification-avatar-icon" />
                        )}
                    </div>

                    <p className="notification-content">
                        {payload?.messageIdentifier}
                    </p>

                    <NotificationCardTime createdAt={createdAt} />
                </div>

                <NotificationCardActions
                    notification={notification}
                    setIsLoading={setIsLoading}
                />
            </NotificationCardStyle>
        )
    );
};

export default NotificationCard;
