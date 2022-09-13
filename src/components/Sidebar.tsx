import { Drawer } from "antd";
import React from "react";

import colors from "../styles/colors";
import AletheiaMenu from "./AletheiaMenu";
import Logo from "./Header/Logo";

const Sidebar = ({ menuCollapsed, onToggleSidebar }) => {
    return (
        <Drawer
            visible={!menuCollapsed}
            onClose={onToggleSidebar}
            width="17rem"
            placement="left"
            bodyStyle={{ padding: 0 }}
            drawerStyle={{
                backgroundColor: colors.lightGray,
            }}
            closable={false}
        >
            <div
                style={{
                    paddingTop: "16px",
                    paddingLeft: "48px",
                }}
            >
                <Logo color={colors.bluePrimary} height="48px" />
            </div>
            <AletheiaMenu />
        </Drawer>
    );
};

export default Sidebar;
