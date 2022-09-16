import { Menu } from "antd";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import React from "react";
import { useDispatch } from "react-redux";

import actions from "../store/actions";
import colors from "../styles/colors";

const AletheiaMenu = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const router = useRouter();

    const handleClick = (menuItem) => {
        dispatch(actions.openSideMenu());
        router.push(menuItem.key);
    };

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
        </Menu>
    );
};

export default AletheiaMenu;
