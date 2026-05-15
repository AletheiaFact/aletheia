import React, { useRef, useState } from "react";

import { Avatar, Box, Stack, Typography } from "@mui/material";
import NameSpaceMenu from "./NameSpaceMenu";
import { NameSpaceEnum } from "../../types/Namespace";
import { BoxMenuHeader } from "./Header.style";
import { User } from "../../types/User";
import { TFunction } from "next-i18next";
import Loading from "../Loading";

export interface UserMenuHeaderProps {
    isLoadingUser: boolean;
    isWhiteLoading?: boolean;
    user: User | null;
    hasSession: boolean;
    nameSpace: string | null;
    t: TFunction;
    isSidebar?: boolean;
}

const UserMenuHeader = ({
    isLoadingUser,
    isWhiteLoading,
    user,
    hasSession,
    nameSpace,
    t,
    isSidebar
}: UserMenuHeaderProps) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const nameSpaceName = nameSpace === NameSpaceEnum.Main ? "Aletheia" : nameSpace;
    const UserMenuHeaderRef = useRef();

    const showNameSpaces = () => {
        setAnchorEl(UserMenuHeaderRef.current);
    };

    if (!hasSession) {
        return
    }

    if (isLoadingUser) {
        return <Loading isWhiteLoading={isWhiteLoading} style={{ height: "20vh" }} />;
    }

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
                isLoading={isLoadingUser}
                userRole={user?.role}
                anchorEl={anchorEl}
                setAnchorEl={setAnchorEl}
                nameSpace={nameSpace}
            />
        </BoxMenuHeader>
    );
};

export default UserMenuHeader;
