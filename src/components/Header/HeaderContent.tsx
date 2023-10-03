import { SearchOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
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
import { ory } from "../../lib/orysdk";

const HeaderContent = () => {
    const dispatch = useDispatch();
    const { vw } = useAppSelector((state) => state);
    const [hasSession, setHasSession] = useState<boolean>(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        ory.frontend
            .toSession()
            .then(async ({ data }) => {
                const user = await userApi.getByOryId(data.identity.id);
                setHasSession(true);
                setUser(user);
            })
            .catch(() => {
                setHasSession(false);
            });
    }, [hasSession]);

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
                <DonateButton header={true} />

                <NotificationMenu user={user} hasSession={hasSession} />
                <UserMenu hasSession={hasSession} user={user} />
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
