import React from "react";
import { useDispatch } from "react-redux";
import actions from "../../store/actions";

import AletheiaButton from "../Button";
import { MenuOutlined } from "@mui/icons-material";
import colors from "../../styles/colors";

const Menu = () => {
    const dispatch = useDispatch();

    return (
        <AletheiaButton
            data-cy="testOpenSideMenu"
            onClick={() => {
                dispatch(actions.openSideMenu());
            }}
        >
            <MenuOutlined
                fontSize="small"
                style={{
                    color: colors.white,
                }}
            />
        </AletheiaButton>
    );
};

export default Menu;
