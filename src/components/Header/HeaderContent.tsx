import { SearchOutlined } from "@ant-design/icons";
import React, { useEffect, useLayoutEffect, useState } from "react";
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
import NotificationMenu from "../Notification/NotificationMenu";
import userApi from "../../api/userApi";
import { NameSpaceEnum } from "../../types/Namespace";
import { useAtom } from "jotai";
import { currentNameSpace } from "../../atoms/namespace";
import { currentUserId } from "../../atoms/currentUser";
import { useRouter } from "next/router";
import localConfig from "../../../config/localConfig.example";

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
                href={href}
                style={{
                    height: "56px",
                    display: "grid",
                    placeContent: "center",
                }}
            >
                <Logo />
            </a>
            <SearchOverlay />
            <HeaderActionsStyle xs={14} sm={10} md={6}>
                {vw?.xs && !router.pathname.includes("/home-page") && (
                    <AletheiaButton
                        onClick={handleClickSearchIcon}
                        data-cy={"testSearchPersonality"}
                        style={{ padding: "4px 15px 0 15px" }}
                    >
                        <SearchOutlined
                            style={{
                                fontSize: "18px",
                                color: "white",
                            }}
                        />
                    </AletheiaButton>
                )}
                {localConfig.header.donateButton.show ? (!hasSession && <DonateButton header={true} />) : null}

                <NotificationMenu hasSession={hasSession} user={user} />
                <UserMenu hasSession={hasSession} user={user} />
                {!vw?.xs && (
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
