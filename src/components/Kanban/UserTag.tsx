import { Avatar, Tooltip } from "antd";
import { useTranslation } from "next-i18next";
import React from "react";
import colors from "../../styles/colors";
import { Roles } from "../../types/enums";

const UserTag = ({ user, userRole, isLoggedIn }) => {
    const { t } = useTranslation();
    const userName =
        userRole !== Roles.Regular && isLoggedIn
            ? user
            : t("userTag:anonymousFactChecker");
    const firstLetter = userName[0];
    return (
        <Tooltip title={userName} placement="top">
            <Avatar
                style={{
                    backgroundColor: colors.blueSecondary,
                    verticalAlign: "middle",
                }}
                size="small"
            >
                {firstLetter}
            </Avatar>
        </Tooltip>
    );
};

export default UserTag;
