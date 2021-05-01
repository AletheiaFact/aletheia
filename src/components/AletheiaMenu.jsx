import React, { Component } from "react";
import { Menu } from "antd";
import { withTranslation } from "react-i18next";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

class AletheiaMenu extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick(menuItem) {
        this.props.dispatch({
            type: "TOGGLE_MENU",
            menuCollapsed: !this.props.menuCollapsed
        });
        this.props.history.push(menuItem.key);
    }
    render() {
        const { t } = this.props;
        return (
            <Menu
                mode="inline"
                theme="light"
                style={{
                    background: "#F5F5F5",
                    color: "#111111"
                }}
                onClick={this.handleClick}
                selectable={false}
            >
                <Menu.Item
                    key="/login"
                    style={{
                        fontSize: "18px"
                    }}
                >
                    {t("menu:myAccountItem")}
                </Menu.Item>
            </Menu>
        );
    }
}
const mapStateToProps = state => {
    return {
        menuCollapsed:
            state?.menuCollapsed !== undefined ? state?.menuCollapsed : true
    };
};
export default connect(mapStateToProps)(
    withTranslation()(withRouter(AletheiaMenu))
);
