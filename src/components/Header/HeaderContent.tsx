import { MenuOutlined, SearchOutlined } from "@ant-design/icons";
import React from "react";
import { useDispatch } from "react-redux";
import actions from "../../store/actions";

import { useAppSelector } from "../../store/store";
import colors from "../../styles/colors";
import AletheiaButton from "../Button";
import SearchOverlay from "../Search/SearchOverlay";
import HeaderActionsStyle from "./HeaderActions.style";
import Logo from "./Logo";
import SelectLanguage from "./SelectLanguage";
import UserMenu from "./UserMenu";

const HeaderContent = () => {
    const dispatch = useDispatch();
    const { vw } = useAppSelector((state) => state);

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
            }}
        >
            <AletheiaButton
                data-cy="testOpenSideMenu"
                onClick={() => {
                    dispatch(actions.openSideMenu());
                }}
            >
                <MenuOutlined
                    style={{
                        fontSize: "16px",
                        color: colors.white,
                    }}
                />
            </AletheiaButton>
            <a
                href="/"
                style={{
                    height: "56px",
                    display: "grid",
                    placeContent: "center",
                }}
            >
                <Logo color="white" />
            </a>
            <SearchOverlay />
            <HeaderActionsStyle>
                {vw?.sm && (
                    <AletheiaButton
                        onClick={handleClickSearchIcon}
                        data-cy={"testSearchPersonality"}
                        style={{ height: "34px" }}
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
