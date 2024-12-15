import { Drawer } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import actions from "../store/actions";
import { useAppSelector } from "../store/store";

import colors from "../styles/colors";
import AletheiaMenu from "./AletheiaMenu";
import Logo from "./Header/Logo";

const Sidebar = () => {
    const dispatch = useDispatch();

    const { menuCollapsed } = useAppSelector((state) => {
        return {
            menuCollapsed:
                state?.menuCollapsed !== undefined
                    ? state?.menuCollapsed
                    : true,
        };
    });

    return (
        <Drawer
            open={!menuCollapsed}
            onClose={() => dispatch(actions.closeSideMenu())}
            width="17rem"
            placement="left"
            bodyStyle={{ padding: 0 }}
            drawerStyle={{
                backgroundColor: colors.lightNeutral,
            }}
            closable={false}
        >
            <div
                style={{
                    paddingTop: "16px",
                    paddingLeft: "48px",
                }}
            >
                <Logo
                    color={colors.primary}
                    height="48px"
                    lineHeight="36px"
                />
            </div>
            <AletheiaMenu />
        </Drawer>
    );
};

export default Sidebar;
