import React from "react";
import { Grid, IconButton } from "@mui/material";

import SelectLanguage from "./SelectLanguage";
import DonateButton from "./DonateButton";
import NotificationMenu from "../Notification/NotificationMenu";
import localConfig from "../../../config/localConfig";
import Menu from "./Menu";
import { useAppSelector } from "../../store/store";
import { SearchOutlined } from "@mui/icons-material";
import storeActions from "../../store/actions";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import SearchOverlay from "../Search/SearchOverlay";
import { useHeaderData } from "./useHeaderData";

const HeaderActions = () => {
    const { state, actions } = useHeaderData();
    const { userId, hasSession, language, languageSections } = state;
    const { changeLanguage } = actions;
    const dispatch = useDispatch();
    const router = useRouter();
    const { vw } = useAppSelector((state) => state);

    return (
        <Grid item className="headerActions">
            <SearchOverlay />
            {!router.pathname.includes("/home-page") && (
                <IconButton
                    onClick={() => { dispatch(storeActions.openResultsOverlay()) }}
                    data-cy="testSearchPersonality"
                    className="navLink"
                >
                    <SearchOutlined />
                </IconButton>
            )}
            {!vw?.md &&
                <SelectLanguage
                    dataCy="testLanguageSelect"
                    currentLanguage={language}
                    sections={languageSections}
                    onChange={changeLanguage}
                />
            }
            <NotificationMenu hasSession={hasSession} userId={userId} />
            {localConfig.header.donateButton.show && !vw?.md &&
                <DonateButton header={true} />
            }
            {vw?.md &&
                <Menu />
            }
        </Grid>
    );
};

export default HeaderActions;
