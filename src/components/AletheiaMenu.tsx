import { Menu } from "antd";
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
        <Menu
            mode="inline"
            theme="light"
            style={{
                backgroundColor: colors.lightGray,
                color: colors.blackPrimary,
                fontSize: "16px",
                padding: "0px 24px",
            }}
            selectable={false}
        >
            <Menu.Item
                key={
                    nameSpace !== NameSpaceEnum.Main
                        ? `/${nameSpace}/personality`
                        : "/personality"
                }
                onClick={handleClick}
                data-cy={"testPersonalitytItem"}
            >
                {t("menu:personalityItem")}
            </Menu.Item>
            <Menu.Item
                key={
                    nameSpace !== NameSpaceEnum.Main
                        ? `/${nameSpace}/claim`
                        : "/claim"
                }
                onClick={handleClick}
                data-cy={"testClaimtItem"}
            >
                {t("menu:claimItem")}
            </Menu.Item>

            {role !== Roles.Regular && (
                <Menu.Item
                    key={
                        nameSpace !== NameSpaceEnum.Main
                            ? `/${nameSpace}/kanban`
                            : "/kanban"
                    }
                    onClick={handleClick}
                    data-cy={"testKanbantItem"}
                >
                    {t("menu:kanbanItem")}
                </Menu.Item>
            )}
            {(role === Roles.Admin || role === Roles.SuperAdmin) && (
                <>
                    <Menu.Item
                        key={
                            nameSpace !== NameSpaceEnum.Main
                                ? `/${nameSpace}/admin`
                                : "/admin"
                        }
                        data-cy={"testadminItem"}
                        onClick={handleClick}
                    >
                        {t("menu:adminItem")}
                    </Menu.Item>
                    <Menu.Item
                        key={
                            nameSpace !== NameSpaceEnum.Main
                                ? `/${nameSpace}/admin/badges`
                                : "/admin/badges"
                        }
                        data-cy={"testadminBadgeItem"}
                        onClick={handleClick}
                    >
                        {t("menu:Badges")}
                    </Menu.Item>
                    <Menu.Item
                        key="/admin/name-spaces"
                        data-cy={"testadminNameSpaceItem"}
                        onClick={handleClick}
                    >
                        {t("menu:nameSpaceItem")}
                    </Menu.Item>
                </>
            )}
            <Menu.Item
                key="/about"
                data-cy={"testAboutItem"}
                onClick={handleClick}
            >
                {t("menu:aboutItem")}
            </Menu.Item>
            <Menu.Item
                key="/privacy-policy"
                data-cy={"testPrivacyPolicyItem"}
                onClick={handleClick}
            >
                {t("menu:privacyPolicyItem")}
            </Menu.Item>
            <Menu.Item
                key="/code-of-conduct"
                data-cy={"testCodeOfConductItem"}
                onClick={handleClick}
            >
                {t("menu:codeOfConductItem")}
            </Menu.Item>

            <Menu.Item key="/donate" onClick={handleClick}>
                {t("header:donateButton")}
            </Menu.Item>
        </Menu>
    );
};

export default AletheiaMenu;
