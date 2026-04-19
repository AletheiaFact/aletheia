import { useRouter } from "next/router";
import React, { Dispatch, SetStateAction } from "react";

import MenuItem from "@mui/material/MenuItem";
import { Menu } from "@mui/material";
import { NameSpaceEnum } from "../../types/Namespace";
import colors from "../../styles/colors";

interface NameSpaceMenuProps {
    isLoading: boolean;
    userRole: string;
    anchorEl: HTMLElement | null;
    setAnchorEl: Dispatch<SetStateAction<HTMLElement | null>>;
    nameSpace: string | null;
}

const NameSpaceMenu = ({ isLoading, userRole, anchorEl, setAnchorEl, nameSpace }: NameSpaceMenuProps) => {
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
