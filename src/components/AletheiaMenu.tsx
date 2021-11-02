import React from "react";
import { Menu } from "antd";
import { useTranslation } from 'next-i18next';
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";

const AletheiaMenu = () => {
    const { t } = useTranslation();
    const { menuCollapsed } = useSelector(
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
        </Menu>
    );
}

export default AletheiaMenu;
