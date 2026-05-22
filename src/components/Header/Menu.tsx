import React from "react";
import { useDispatch } from "react-redux";
import actions from "../../store/actions";

import { MenuOutlined, Close } from "@mui/icons-material";
import colors from "../../styles/colors";
import { IconButton } from "@mui/material";
import { useAppSelector } from "../../store/store";

const Menu = () => {
    const dispatch = useDispatch();

    const { vw, menuCollapsed } = useAppSelector((state) => state);

    const isCollapsed = menuCollapsed !== undefined ? menuCollapsed : true;

    const handleToggleMenu = () => {
        if (isCollapsed) {
            dispatch(actions.openSideMenu());
        } else {
            dispatch(actions.closeSideMenu());
        }
    };

    return (
        <IconButton
            data-cy={isCollapsed ? "testOpenSideMenu" : "testCloseSideMenu"}
            onClick={handleToggleMenu}
            size="large"
            sx={{ padding: vw?.xs ? "0px" : "5px 15px" }}
        >
            {isCollapsed ? (
                <MenuOutlined style={{ color: colors.white }} />
            ) : (
                <Close style={{ color: colors.white }} />
            )}
        </IconButton>
    );
};

export default Menu;
