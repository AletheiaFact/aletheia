import React from "react";
import { Menu } from "antd";
import { useTranslation } from 'next-i18next';
import { connect } from "react-redux";

const AletheiaMenu = ({ dispatch, menuCollapsed }) => {
    const { t } = useTranslation("common");
    const handleClick = (menuItem) => {
        dispatch({
            type: "TOGGLE_MENU",
            menuCollapsed: !menuCollapsed
        });
        // this.props.history.push(menuItem.key);
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
                {t("myAccountItem")}
            </Menu.Item>
        </Menu>
    );
}

const mapStateToProps = state => {
    return {
        menuCollapsed:
            state?.menuCollapsed !== undefined ? state?.menuCollapsed : true
    };
};
export default connect(mapStateToProps)(AletheiaMenu);
