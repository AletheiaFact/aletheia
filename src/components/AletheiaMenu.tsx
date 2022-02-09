import React from "react";
import { Menu } from "antd";
import { useTranslation } from 'next-i18next';
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { useAppSelector } from "../store/store";

const AletheiaMenu = () => {
    const { t } = useTranslation();
    const { menuCollapsed } = useAppSelector(
        (state) => {
            return {
                menuCollapsed:
                    state?.menuCollapsed !== undefined ? state?.menuCollapsed : true
            };
        }
    );
    const dispatch = useDispatch();
    const router = useRouter();

    const handleClick = (menuItem) => {
        dispatch({
            type: "TOGGLE_MENU",
            menuCollapsed: !menuCollapsed
        });
        router.push(menuItem.key);
    }

    return (
        <Menu
            mode="inline"
            theme="light"
            style={{
                background: "#F5F5F5",
                color: "#111111"
            }}
            onClick={handleClick}
            selectable={false}
        >
            <Menu.Item
                key="/profile"
                style={{
                    fontSize: "18px"
                }}
            >
                {t("menu:myAccountItem")}
            </Menu.Item>
            <Menu.Item
                key="/about"
                style={{
                    fontSize: "18px"
                }}
            >
                {t("menu:aboutItem")}
            </Menu.Item>
            <Menu.Item
                key="/privacy-policy"
                style={{
                    fontSize: "18px"
                }}
            >
                {t("menu:privacyPolicyItem")}
            </Menu.Item>
            <Menu.Item
                key="/code-of-conduct"
                style={{
                    fontSize: "18px"
                }}
            >
                {t("menu:codeOfConductItem")}
            </Menu.Item>
        </Menu>
    );
}

export default AletheiaMenu;
