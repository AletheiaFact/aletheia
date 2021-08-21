import React from "react";
import { Menu } from "antd";
import { useTranslation } from 'next-i18next';
import {connect, useDispatch, useSelector} from "react-redux";
import {useRouter} from "next/router";

const mapStateToProps = () => {
    return useSelector(
        (state) => {
            return {
                menuCollapsed:
                    state?.menuCollapsed !== undefined ? state?.menuCollapsed : true
            };
        }
    );
};

const AletheiaMenu = () => {
    const { t } = useTranslation();
    const { menuCollapsed } = mapStateToProps();
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
