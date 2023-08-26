import { SearchOutlined } from "@ant-design/icons";
import React from "react";
import { useDispatch } from "react-redux";
import actions from "../../store/actions";

import { useAppSelector } from "../../store/store";
import AletheiaButton from "../Button";
import SearchOverlay from "../Search/SearchOverlay";
import HeaderActionsStyle from "./HeaderActions.style";
import Logo from "./Logo";
import SelectLanguage from "./SelectLanguage";
import UserMenu from "./UserMenu";
import DonateButton from "./DonateButton";
import Menu from "./Menu";

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
            <Menu />
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
            <HeaderActionsStyle xs={14} sm={6} md={6}>
                {vw?.xs && (
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
                <DonateButton />
                <UserMenu />
                {!vw?.sm && (
                    <SelectLanguage
                        dataCy={"LanguageButton"}
                        defaultLanguage="pt"
                    />
                )}
            </HeaderActionsStyle>
        </div>
    );
};

export default HeaderContent;
