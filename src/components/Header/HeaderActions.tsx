import React, { useEffect, useState } from "react";
import { Grid, IconButton } from "@mui/material";

import SelectLanguage from "./SelectLanguage";
import DonateButton from "./DonateButton";
import NotificationMenu from "../Notification/NotificationMenu";
import { useAtom } from "jotai";
import { currentUserId } from "../../atoms/currentUser";
import userApi from "../../api/userApi";
import localConfig from "../../../config/localConfig";
import Menu from "./Menu";
import { useAppSelector } from "../../store/store";
import { SearchOutlined } from "@mui/icons-material";
import actions from "../../store/actions";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import SearchOverlay from "../Search/SearchOverlay";

const HeaderActions = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { vw } = useAppSelector((state) => state);
    const [userId] = useAtom(currentUserId);
    const hasSession = !!userId;
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (hasSession) {
            userApi.getById(userId).then((user) => {
                setUser(user);
            });
        }
    }, [hasSession, userId]);

    return (
        <Grid item className="headerActions">
            <SearchOverlay />
            {!router.pathname.includes("/home-page") && (
                <IconButton
                    onClick={() => { dispatch(actions.openResultsOverlay()) }}
                    data-cy="testSearchPersonality"
                    className="navLink"
                >
                    <SearchOutlined />
                </IconButton>
            )}
            {!vw?.md &&
                <SelectLanguage dataCy="LanguageButton" defaultLanguage="pt" />
            }
            <NotificationMenu hasSession={hasSession} user={user} />
            {localConfig.header.donateButton.show &&
                <DonateButton header={true} />
            }
            {vw?.md &&
                <Menu />
            }
        </Grid>
    );
};

export default HeaderActions;
