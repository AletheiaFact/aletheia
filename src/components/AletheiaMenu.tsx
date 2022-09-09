import { Menu } from "antd";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { useAppSelector } from "../store/store";
import { ActionTypes } from "../store/types";

const AletheiaMenu = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const router = useRouter();

    const { menuCollapsed } = useAppSelector((state) => {
        return {
            menuCollapsed:
                state?.menuCollapsed !== undefined
                    ? state?.menuCollapsed
                    : true,
        };
    });

    const handleClick = (menuItem) => {
        dispatch({
            type: ActionTypes.TOGGLE_MENU,
            menuCollapsed: !menuCollapsed,
        });
        router.push(menuItem.key);
    };

    return (
        <Menu
            mode="inline"
            theme="light"
            style={{
                background: "#F5F5F5",
                color: "#111111",
                padding: "0px 24px",
            }}
            selectable={false}
        >
            <Menu.Item
                key="/about"
                data-cy={"testAboutItem"}
                style={{
                    fontSize: "18px",
                }}
                onClick={handleClick}
            >
                {t("menu:aboutItem")}
            </Menu.Item>
            <Menu.Item
                key="/privacy-policy"
                data-cy={"testPrivacyPolicyItem"}
                style={{
                    fontSize: "18px",
                }}
                onClick={handleClick}
            >
                {t("menu:privacyPolicyItem")}
            </Menu.Item>
            <Menu.Item
                key="/code-of-conduct"
                data-cy={"testCodeOfConductItem"}
                style={{
                    fontSize: "18px",
                }}
                onClick={handleClick}
            >
                {t("menu:codeOfConductItem")}
            </Menu.Item>
        </Menu>
    );
};

export default AletheiaMenu;
