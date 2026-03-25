import React from "react";
import colors from "../../styles/colors";
import { Badge, Button } from "@mui/material";
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';

const NotificationIcon = ({ unseenCount }) => {
    return (
        <Button
            className="navLink"
            data-cy="testNotificationIcon"
        >
            <Badge
                color="error"
                overlap="circular"
                badgeContent={unseenCount}
            >
                <NotificationsNoneIcon
                    style={{ color: colors.white, cursor: "pointer" }}
                />
            </Badge>
        </Button>
    );
};

export default NotificationIcon;
