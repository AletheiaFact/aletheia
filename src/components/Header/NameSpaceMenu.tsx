import { useRouter } from "next/router";
import React from "react";

import MenuItem from "@mui/material/MenuItem";
import { Menu } from "@mui/material";
import { currentNameSpace } from "../../atoms/namespace";
import { useAtom } from "jotai";
import { NameSpaceEnum } from "../../types/Namespace";
import colors from "../../styles/colors";

const NameSpaceMenu = ({ isLoading, userRole, anchorEl, setAnchorEl }) => {
    const [nameSpace] = useAtom(currentNameSpace);
    const router = useRouter();

    const handleClose = () => {
        setAnchorEl(null);
    };

    const openPopover = Boolean(anchorEl);

    const handleNameSpaceClick = (nameSpaceItem) => {
        setAnchorEl(null);
        if (nameSpace !== nameSpaceItem) {
            router.push(
                nameSpaceItem === NameSpaceEnum.Main ? `/` : `/${nameSpaceItem}`
            );
        }
    };

    return (
        <Menu
            anchorEl={anchorEl}
            open={openPopover}
            onClose={handleClose}
            MenuListProps={{
                "aria-labelledby": "basic-button",
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
            {userRole &&
                Object.keys(userRole).map((nameSpaceSlug) => (
                    <MenuItem
                        key={nameSpaceSlug}
                        sx={{
                            fontSize: 12,
                            backgroundColor:
                                nameSpace === nameSpaceSlug
                                    ? "rgba(0, 0, 0, 0.08)"
                                    : colors.white,
                            gap: 1,
                        }}
                        onClick={() => handleNameSpaceClick(nameSpaceSlug)}
                        disabled={isLoading}
                    >
                        {nameSpaceSlug === NameSpaceEnum.Main
                            ? "Aletheia"
                            : nameSpaceSlug.replace("-", " ")}
                    </MenuItem>
                ))}
        </Menu>
    );
};

export default NameSpaceMenu;
