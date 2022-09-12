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
            width="270px"
            placement="left"
            bodyStyle={{ padding: 0 }}
            drawerStyle={{
                backgroundColor: colors.lightGray,
                alignItems: "flex-start",
            }}
            closable={false}
        >
            <Logo color={colors.bluePrimary} />
            <AletheiaMenu />
        </Drawer>
    );
};

export default Sidebar;
