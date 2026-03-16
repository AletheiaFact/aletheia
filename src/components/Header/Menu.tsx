import React from "react";
import { useDispatch } from "react-redux";
import actions from "../../store/actions";

import { MenuOutlined } from "@mui/icons-material";
import colors from "../../styles/colors";
import { IconButton } from "@mui/material";
import { useAppSelector } from "../../store/store";

const Menu = () => {
    const dispatch = useDispatch();
    const { vw } = useAppSelector((state) => state);

    return (
        <IconButton
            data-cy="testOpenSideMenu"
            onClick={() => {
                dispatch(actions.openSideMenu());
            }}
            size="large"
            sx={{ padding: vw?.xs ? "0px" : "5px 15px" }}
        >
            <MenuOutlined
                style={{
                    color: colors.white,
                }}
            />
        </IconButton>
    );
};

export default Menu;
