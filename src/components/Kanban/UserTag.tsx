import { Avatar } from "@mui/material";
import InfoTooltip from "../Claim/InfoTooltip";
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
        <InfoTooltip
            useCustomStyle={false}
            content={userName}
            children={
                <Avatar
                    style={{
                        backgroundColor: colors.secondary,
                        verticalAlign: "middle",
                        width: 24,
                        height: 24,
                        fontSize: 15
                    }}
                >
                    {firstLetter}
                </Avatar>
            }
        />
    );
};

export default UserTag;
