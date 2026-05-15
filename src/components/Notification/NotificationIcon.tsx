import React from "react";
import colors from "../../styles/colors";
import { Badge } from "@mui/material";
import AletheiaButton, { ButtonType } from "../AletheiaButton";
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';

const NotificationIcon = ({ unseenCount }: { unseenCount: number }) => {
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
                <NotificationsNoneIcon
                    style={{ color: colors.white, cursor: "pointer" }}
                />
            </Badge>
        </Button>
    );
};

export default NotificationIcon;
