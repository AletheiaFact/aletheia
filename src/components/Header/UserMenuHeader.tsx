import React, { useRef } from "react";

import { Avatar, Box, Stack, Typography } from "@mui/material";
import NameSpaceMenu from "./NameSpaceMenu";
import { NameSpaceEnum } from "../../types/Namespace";
import { useHeaderData } from "./useHeaderData";
import { BoxMenuHeader } from "./Header.style";
import { User } from "../../types/User";
import { TFunction } from "next-i18next";

export interface UserMenuHeaderProps {
    isLoading: boolean;
    user: User;
    nameSpace: string | null;
    t: TFunction;
    isSidebar?: boolean;
}

const UserMenuHeader = ({
    isLoading,
    user,
    nameSpace,
    t,
    isSidebar
}: UserMenuHeaderProps) => {
    const { state, actions } = useHeaderData();
    const nameSpaceName = nameSpace === NameSpaceEnum.Main ? "Aletheia" : nameSpace;
    const UserMenuHeaderRef = useRef();

    const showNameSpaces = () => {
        actions.setAnchorEl(UserMenuHeaderRef.current);
    };

    return (
        <BoxMenuHeader $isSidebar={isSidebar}>
            <Box ref={UserMenuHeaderRef} className="menu-header">
                <Avatar className="menu-header-avatar" sx={{ m: 0 }}>
                    {user?.name?.slice(0, 1).toUpperCase()}
                </Avatar>

                <Box sx={{ width: "100%" }}>
                    <Typography variant="subtitle2" className="menu-header-info name">
                        {user?.name}
                    </Typography>

                    <Typography variant="body2" className="menu-header-info email">
                        {user?.email}
                    </Typography>

                    <Stack className="menu-header-info namespace">
                        <Typography variant="caption" className="menu-header-info name title-namespace">
                            {nameSpaceName.replace("-", " ")}
                        </Typography>

                        <Typography
                            variant="caption"
                            onClick={showNameSpaces}
                            className="select-namespace"
                        >
                            {t<string>("common:change")}
                        </Typography>
                    </Stack>
                </Box>
            </Box>

            <NameSpaceMenu
                isLoading={isLoading}
                userRole={user?.role}
                anchorEl={state.anchorEl}
                setAnchorEl={actions.setAnchorEl}
                nameSpace={nameSpace}
            />
        </BoxMenuHeader>
    );
};

export default UserMenuHeader;
