import { MenuOutlined } from "@ant-design/icons";
import React from "react";
import { useDispatch } from "react-redux";

import { useAppSelector } from "../../store/store";
import { ActionTypes } from "../../store/types";
import colors from "../../styles/colors";
import AletheiaButton from "../Button";
import SearchOverlay from "../Search/SearchOverlay";
import Logo from "./Logo";
import SelectLanguage from "./SelectLanguage";

const HeaderContent = () => {
    const dispatch = useDispatch();
    const { menuCollapsed } = useAppSelector((state) => {
        return {
            menuCollapsed:
                state?.menuCollapsed !== undefined
                    ? state?.menuCollapsed
                    : true,
        };
    });

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                padding: "0 15px",
                justifyContent: "space-between",
                minWidth: "450px",
            }}
        >
            <AletheiaButton
                data-cy="testOpenSideMenu"
                onClick={() => {
                    dispatch({
                        type: ActionTypes.TOGGLE_MENU,
                        menuCollapsed: !menuCollapsed,
                    });
                }}
            >
                <MenuOutlined
                    style={{
                        fontSize: "16px",
                        color: colors.white,
                    }}
                />
            </AletheiaButton>
            <a href="/">
                <Logo color="white" />
            </a>
            <SearchOverlay />
            <SelectLanguage dataCy={"LanguageButton"} defaultLanguage="pt" />
        </div>
    );
};

export default HeaderContent;
