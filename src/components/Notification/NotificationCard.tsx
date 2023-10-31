import React, { useState } from "react";
import { Badge, Spin } from "antd";
import colors from "../../styles/colors";
import { LoadingOutlined } from "@ant-design/icons";
import DraftsOutlinedIcon from "@mui/icons-material/DraftsOutlined";
import MailOutlineOutlinedIcon from "@mui/icons-material/MailOutlineOutlined";
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
            console.log(payload);
            setIsLoading(true);
            window.location = payload.redirectUrl;
        }
    };

    return (
        <Spin
            indicator={<LoadingOutlined />}
            spinning={isLoading}
            style={{ fontSize: 48, color: colors.bluePrimary, display: "flex" }}
        >
            <NotificationCardStyle isSeen={isSeen} namespace={nameSpace}>
                <div className="container" onClick={handleContainerClick}>
                    <div className="notification-avatar">
                        {!isSeen && <Badge status="processing" />}

                        {!isSeen ? (
                            <MailOutlineOutlinedIcon className="notification-avatar-icon" />
                        ) : (
                            <DraftsOutlinedIcon className="notification-avatar-icon" />
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
        </Spin>
    );
};

export default NotificationCard;
