import React from "react";
import colors from "../../styles/colors";
import { Badge } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AletheiaButton, { ButtonType } from "../AletheiaButton";

const NotificationIcon = ({ unseenCount }) => {
    return (
        <AletheiaButton
            type={ButtonType.text}
            data-cy="testNotificationIcon"
        >
            <Badge
                color="error"
                overlap="circular"
                badgeContent={unseenCount}
            >
                <NotificationsIcon
                    style={{ color: colors.white, cursor: "pointer" }}
                />
            </Badge>
        </AletheiaButton>
    );
};

export default NotificationIcon;
