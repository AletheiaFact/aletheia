import { MenuOutlined, SearchOutlined } from "@ant-design/icons";
import React from "react";
import { useDispatch } from "react-redux";
import actions from "../../store/actions";

import { useAppSelector } from "../../store/store";
import { ActionTypes } from "../../store/types";
import colors from "../../styles/colors";
import AletheiaButton from "../Button";
import SearchOverlay from "../Search/SearchOverlay";
import HeaderActionsStyle from "./HeaderActions.style";
import Logo from "./Logo";
import SelectLanguage from "./SelectLanguage";
import UserMenu from "./UserMenu";

const HeaderContent = () => {
    const dispatch = useDispatch();
    const { vw, menuCollapsed } = useAppSelector((state) => {
        return {
            vw: state.vw,
            menuCollapsed:
                state?.menuCollapsed !== undefined
                    ? state?.menuCollapsed
                    : true,
        };
    });

    const handleClickSearchIcon = () => {
        dispatch(actions.openResultsOverlay());
    };

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                padding: vw?.xs ? "0" : "0 15px",
                justifyContent: "space-evenly",
                minWidth: "335px",
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
            <HeaderActionsStyle>
                {vw?.sm && (
                    <AletheiaButton
                        onClick={handleClickSearchIcon}
                        data-cy={"testSearchPersonality"}
                    >
                        <SearchOutlined
                            style={{
                                fontSize: "16px",
                                color: "white",
                                padding: "8px",
                            }}
                        />
                    </AletheiaButton>
                )}
                <UserMenu />
                <SelectLanguage
                    dataCy={"LanguageButton"}
                    defaultLanguage="pt"
                />
            </HeaderActionsStyle>
        </div>
    );
};

export default HeaderContent;
