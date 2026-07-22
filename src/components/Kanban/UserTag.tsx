import { Avatar } from "@mui/material";
import InfoTooltip from "../Claim/InfoTooltip";
import React from "react";
import { useAtom } from "jotai";
import { currentUserRole, isUserLoggedIn } from "../../atoms/currentUser";
import colors from "../../styles/colors";
import { Roles } from "../../types/enums";
import { useTranslations } from "next-intl";

const UserTag = ({ user }) => {
    const tUserTag = useTranslations("userTag");
    const [role] = useAtom(currentUserRole);
    const [isLoggedIn] = useAtom(isUserLoggedIn);
    const userName =
        role !== Roles.Regular && isLoggedIn
            ? user
            : tUserTag("anonymousFactChecker");
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
