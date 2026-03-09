import { SearchOutlined } from "@mui/icons-material";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useDispatch } from "react-redux";
import actions from "../../store/actions";

import { useAppSelector } from "../../store/store";
import SearchOverlay from "../Search/SearchOverlay";
import Logo from "./Logo";
import SelectLanguage from "./SelectLanguage";
import UserMenu from "./UserMenu";
import DonateButton from "./DonateButton";
import Menu from "./Menu";
import NotificationMenu from "../Notification/NotificationMenu";
import userApi from "../../api/userApi";
import { NameSpaceEnum } from "../../types/Namespace";
import { useAtom } from "jotai";
import { currentNameSpace } from "../../atoms/namespace";
import { currentUserId } from "../../atoms/currentUser";
import { useRouter } from "next/router";
import localConfig from "../../../config/localConfig";
import { Grid, IconButton, Link } from "@mui/material";
import HeaderGridStyle from "./HeaderActions.style";

const HeaderContent = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { vw } = useAppSelector((state) => state);
    const [userId] = useAtom(currentUserId);
    const hasSession = !!userId;
    const [user, setUser] = useState(null);
    const [nameSpace] = useAtom(currentNameSpace);
    const [href, setHref] = useState("/");

    useLayoutEffect(() => {
        setHref(nameSpace !== NameSpaceEnum.Main ? `/${nameSpace}` : "/");
    }, [nameSpace]);

    useEffect(() => {
        if (hasSession) {
            userApi.getById(userId).then((user) => {
                setUser(user);
            });
        }
    }, [hasSession, userId]);

    return (
        <HeaderGridStyle container>
            <Menu />
            <Link href={href} className="headerLogo">
                <Logo />
            </Link>
            <SearchOverlay />
            <Grid item className="headerActions">
                {vw?.xs && !router.pathname.includes("/home-page") && (
                    <IconButton
                        onClick={() => { dispatch(actions.openResultsOverlay()) }}
                        data-cy={"testSearchPersonality"}
                        size="large"
                        sx={{ color: "white", padding: "0px" }}
                    >
                        <SearchOutlined />
                    </IconButton>
                )}
                {localConfig.header.donateButton.show
                    ? !hasSession && <DonateButton header={true} />
                    : null}

                <NotificationMenu hasSession={hasSession} user={user} />
                <UserMenu hasSession={hasSession} user={user} />
                {!vw?.xs && (
                    <SelectLanguage
                        dataCy={"LanguageButton"}
                        defaultLanguage="pt"
                    />
                )}
            </Grid >
        </HeaderGridStyle >
    );
};

export default HeaderContent;
