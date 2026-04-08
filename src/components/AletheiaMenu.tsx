import { List, ListItemButton } from "@mui/material";
import { useAtom, useAtomValue } from "jotai";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import React from "react";
import { useDispatch } from "react-redux";
import { currentUserRole } from "../atoms/currentUser";

import actions from "../store/actions";
import colors from "../styles/colors";
import { Roles } from "../types/enums";
import { NameSpaceEnum } from "../types/Namespace";
import { currentNameSpace } from "../atoms/namespace";
import localConfig from "../../config/localConfig";
import { isAdmin } from "../utils/GetUserPermission";
import { featureFlagsAtom } from "../atoms/featureFlags";

const AletheiaMenu = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const router = useRouter();
    const [nameSpace] = useAtom(currentNameSpace);
    const { enableEventsFeature } = useAtomValue(featureFlagsAtom);

    const handleClick = (menuItem) => {
        dispatch(actions.openSideMenu());
        if (menuItem.key === "/donate") {
            window.location.href = "https://donate.aletheiafact.org/";
        } else {
            router.push(menuItem.key);
        }
    };

    const [role] = useAtom(currentUserRole);

    return (
        <List
            style={{
                backgroundColor: colors.lightNeutral,
                color: colors.black,
                fontSize: "16px",
                padding: "0px 24px",
            }}
        >
            <ListItemButton
                onClick={() => handleClick({
                    key:
                        nameSpace !== NameSpaceEnum.Main
                            ? `/${nameSpace}/personality`
                            : "/personality"
                })}
                data-cy={"testPersonalitytItem"}
            >
                {t("header:personalityItem")}
            </ListItemButton>
            <ListItemButton
                onClick={() => handleClick({
                    key:
                        nameSpace !== NameSpaceEnum.Main
                            ? `/${nameSpace}/claim`
                            : "/claim"
                })}
                data-cy={"testClaimtItem"}
            >
                {t("header:claimItem")}
            </ListItemButton>

            {/*Temporarily removing source redirect from the hamburger menu.*/}
            {/* <ListItemButton
                onClick={() => handleClick({
                    key:
                        nameSpace !== NameSpaceEnum.Main
                            ? `/${nameSpace}/source`
                            : "/source"
                })}
                data-cy={"testSourcetItem"}
            >
                {t("header:sourcesItem")}
            </ListItemButton> */}

            <ListItemButton
                onClick={() => handleClick({
                    key:
                        nameSpace !== NameSpaceEnum.Main
                            ? `/${nameSpace}/verification-request`
                            : "/verification-request"
                })}
                data-cy={"testVerificationRequestItem"}
            >
                {t("header:verificationRequestItem")}
            </ListItemButton>

            {enableEventsFeature && (
                <ListItemButton
                    onClick={() => handleClick({
                        key:
                            nameSpace !== NameSpaceEnum.Main
                                ? `/${nameSpace}/event`
                                : "/event"
                    })}
                    data-cy={"testEventItem"}
                >
                    {t("header:eventItem")}
                </ListItemButton>
            )}

            {role !== Roles.Regular && (
                <ListItemButton
                    onClick={() => handleClick({
                        key:
                            nameSpace !== NameSpaceEnum.Main
                                ? `/${nameSpace}/kanban`
                                : "/kanban"
                    })}
                    data-cy={"testKanbantItem"}
                >
                    {t("header:kanbanItem")}
                </ListItemButton>
            )}
            {isAdmin(role) && (
                <>
                    <ListItemButton
                        data-cy={"testadminItem"}
                        onClick={() => handleClick({
                            key:
                                nameSpace !== NameSpaceEnum.Main
                                    ? `/${nameSpace}/admin`
                                    : "/admin"
                        })}
                    >
                        {t("header:adminItem")}
                    </ListItemButton>
                    <ListItemButton
                        data-cy={"testadminBadgeItem"}
                        onClick={() => handleClick({
                            key:
                                nameSpace !== NameSpaceEnum.Main
                                    ? `/${nameSpace}/admin/badges`
                                    : "/admin/badges"
                        })}
                    >
                        {t("header:Badges")}
                    </ListItemButton>
                    <ListItemButton
                        data-cy={"testadminNameSpaceItem"}
                        onClick={() => handleClick({
                            key: "/admin/name-spaces"
                        })}
                    >
                        {t("header:nameSpaceItem")}
                    </ListItemButton>
                </>
            )}
            <ListItemButton
                data-cy={"testAboutItem"}
                onClick={() => handleClick({
                    key: "/about",
                })}
            >
                {t("header:aboutItemTitle")}
            </ListItemButton>
            <ListItemButton
                data-cy={"testPrivacyPolicyItem"}
                onClick={() => handleClick({
                    key: "/privacy-policy",
                })}
            >
                {t("header:privacyPolicyItemTitle")}
            </ListItemButton>
            <ListItemButton
                data-cy={"testCodeOfConductItem"}
                onClick={() => handleClick({
                    key: "/code-of-conduct",
                })}
            >
                {t("header:codeOfConductItemTitle")}
            </ListItemButton>
            <ListItemButton
                data-cy={"testSupportiveMaterialsItem"}
                onClick={() => handleClick({
                    key: "/supportive-materials",
                })}
            >
                {t("header:supportiveMaterialsItemTitle")}
            </ListItemButton>

            {localConfig.header.donateButton.show
                ?
                <ListItemButton
                    onClick={() => handleClick({
                        key: "/donate",
                    })}
                >
                    {t("header:donateButton")}
                </ListItemButton>
                : null}
        </List>
    );
};

export default AletheiaMenu;
