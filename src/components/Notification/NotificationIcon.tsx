import React from "react";
import colors from "../../styles/colors";
import { Badge } from "antd";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AletheiaButton from "../Button";

const NotificationIcon = ({ unseenCount }) => {
    return (
        <AletheiaButton
            style={{ padding: "4px 15px 0 15px" }}
            data-cy="testNotificationIcon"
        >
            <Badge
                style={{ boxShadow: "none" }}
                size="small"
                count={unseenCount}
            >
                <NotificationsIcon
                    style={{ color: colors.white, cursor: "pointer" }}
                />
            </Badge>
        </AletheiaButton>
    );
};

export default NotificationIcon;
