import React from "react";
import { useRemoveNotification } from "@novu/notification-center";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

const NotificationCardActions = ({ notification, setIsLoading }) => {
    const { removeNotification } = useRemoveNotification();

    const handleClick = () => {
        removeNotification({ messageId: notification?.id });
        setIsLoading(true);
    };

    return (
        <div className="actions-container" onClick={handleClick}>
            <DeleteOutlineOutlinedIcon />
        </div>
    );
};

export default NotificationCardActions;
