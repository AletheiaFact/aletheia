import React, { useRef } from "react";

import { Avatar, Box } from "@mui/material";
import { currentNameSpace } from "../../atoms/namespace";
import { useAtom } from "jotai";
import NameSpaceMenu from "./NameSpaceMenu";
import { NameSpaceEnum } from "../../types/Namespace";
import { useTranslation } from "next-i18next";
import colors from "../../styles/colors";

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
                <Avatar style={{ margin: 0 }} className="menu-header-avatar">
                    {user?.name?.slice(0, 1).toUpperCase()}
                </Avatar>
                <Box sx={{ width: "100%" }}>
                    <p className="menu-header-info name">{user?.name}</p>
                    <p className="menu-header-info email">{user?.email}</p>
                    <Box
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontSize: 12,
                            marginTop: 4,
                        }}
                    >
                        <strong style={{ color: colors.primary }}>
                            {nameSpaceName.replace("-", " ")}
                        </strong>
                        <span
                            style={{
                                marginLeft: 4,
                                color: "#0473f2",
                                cursor: "pointer",
                            }}
                            onClick={showNameSpaces}
                        >
                            {t("common:change")}
                        </span>
                    </Box>
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
