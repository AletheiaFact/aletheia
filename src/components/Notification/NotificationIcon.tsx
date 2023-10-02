import React from "react";
import styled from "styled-components";
import colors from "../../styles/colors";
import { Badge } from "antd";
import NotificationsIcon from "@mui/icons-material/Notifications";

const NotificationStyled = styled.div`
    display: flex;
    align-items: center;
    padding-left: 15px;
    padding-top: 6px;

    .notification-icon {
        color: ${colors.white};
        cursor: pointer;
    }
`;

const NotificationIcon = ({ unseenCount }) => {
    return (
        <NotificationStyled>
            <Badge
                style={{ boxShadow: "none" }}
                size="small"
                count={unseenCount}
            >
                <NotificationsIcon className="notification-icon" />
            </Badge>
        </NotificationStyled>
    );
};

export default NotificationIcon;
