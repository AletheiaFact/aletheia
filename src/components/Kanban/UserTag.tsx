import { Avatar, Tooltip } from "antd";
import { useTranslation } from "next-i18next";
import React from "react";
import { useAtom } from "jotai";
import { currentUserRole, isUserLoggedIn } from "../../atoms/currentUser";
import colors from "../../styles/colors";
import { Roles } from "../../types/enums";

const UserTag = ({ user }) => {
    const { t } = useTranslation();
    const [role] = useAtom(currentUserRole);
    const [isLoggedIn] = useAtom(isUserLoggedIn);
    const userName =
        role !== Roles.Regular && isLoggedIn
            ? user
            : t("userTag:anonymousFactChecker");
    const firstLetter = userName[0];
    return (
        <Tooltip title={userName} placement="top">
            <Avatar
                style={{
                    backgroundColor: colors.secondary,
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
