import { List, ListItemButton } from "@mui/material";
import { useAtom } from "jotai";
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

const AletheiaMenu = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const router = useRouter();
    const [nameSpace] = useAtom(currentNameSpace);

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
                {t("menu:personalityItem")}
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
                {t("menu:claimItem")}
            </ListItemButton>

            <ListItemButton
                onClick={() => handleClick({
                    key:
                        nameSpace !== NameSpaceEnum.Main
                            ? `/${nameSpace}/source`
                            : "/source"
                })}
                data-cy={"testSourcetItem"}
            >
                {t("menu:sourcesItem")}
            </ListItemButton>

            <ListItemButton
                onClick={() => handleClick({
                    key:
                        nameSpace !== NameSpaceEnum.Main
                            ? `/${nameSpace}/verification-request`
                            : "/verification-request"
                })}
                data-cy={"testVerificationRequestItem"}
            >
                {t("menu:verificationRequestItem")}
            </ListItemButton>

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
                    {t("menu:kanbanItem")}
                </ListItemButton>
            )}
            {(role === Roles.Admin || role === Roles.SuperAdmin) && (
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
                        {t("menu:adminItem")}
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
                        {t("menu:Badges")}
                    </ListItemButton>
                    <ListItemButton
                        data-cy={"testadminNameSpaceItem"}
                        onClick={() => handleClick({
                            key: "/admin/name-spaces"
                        })}
                    >
                        {t("menu:nameSpaceItem")}
                    </ListItemButton>
                </>
            )}
            <ListItemButton
                data-cy={"testAboutItem"}
                onClick={() => handleClick({
                    key: "/about",
                })}
            >
                {t("menu:aboutItem")}
            </ListItemButton>
            <ListItemButton
                data-cy={"testPrivacyPolicyItem"}
                onClick={() => handleClick({
                    key: "/privacy-policy",
                })}
            >
                {t("menu:privacyPolicyItem")}
            </ListItemButton>
            <ListItemButton
                data-cy={"testCodeOfConductItem"}
                onClick={() => handleClick({
                    key: "/code-of-conduct",
                })}
            >
                {t("menu:codeOfConductItem")}
            </ListItemButton>
            <ListItemButton
                data-cy={"testSupportiveMaterialsItem"}
                onClick={() => handleClick({
                    key: "/supportive-materials",
                })}
            >
                {t("menu:supportiveMaterials")}
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
