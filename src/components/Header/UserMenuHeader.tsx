import React, { useRef } from "react";

import { Avatar, Box, Stack, Typography } from "@mui/material";
import { currentNameSpace } from "../../atoms/namespace";
import { useAtom } from "jotai";
import NameSpaceMenu from "./NameSpaceMenu";
import { NameSpaceEnum } from "../../types/Namespace";
import { useTranslation } from "next-i18next";

const UserMenuHeader = ({ isLoading, user }) => {
    const { t } = useTranslation();
    const [nameSpace] = useAtom(currentNameSpace);
    const nameSpaceName =
        nameSpace === NameSpaceEnum.Main ? "Aletheia" : nameSpace;
    const UserMenuHeaderRef = useRef();
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
        null
    );

    const showNameSpaces = () => {
        setAnchorEl(UserMenuHeaderRef.current);
    };

    return (
        <>
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
                        <Typography variant="caption" className="menu-header-info name">
                            {nameSpaceName.replace("-", " ")}
                        </Typography>

                        <Typography
                            variant="caption"
                            onClick={showNameSpaces}
                            className="select-namespace"
                        >
                            {t("common:change")}
                        </Typography>
                    </Stack>
                </Box>
            </Box>

            <NameSpaceMenu
                isLoading={isLoading}
                userRole={user?.role}
                anchorEl={anchorEl}
                setAnchorEl={setAnchorEl}
            />
        </>
    );
};

export default UserMenuHeader;
