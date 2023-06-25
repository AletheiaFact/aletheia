import { Drawer } from "antd";
import React from "react";
import { useAppSelector } from "../store/store";
import colors from "../styles/colors";

const LargeDrawer = ({
    children,
    visible,
    onClose,
    backgroundColor = colors.lightGray,
}) => {
    const { vw } = useAppSelector((state) => state);
    return (
        <Drawer
            visible={visible}
            onClose={onClose}
            width={vw?.sm ? "100%" : "60%"}
            height={vw?.sm ? "85%" : "100%"}
            placement={vw?.sm ? "bottom" : "right"}
            bodyStyle={{ padding: 0 }}
            drawerStyle={{
                backgroundColor,
            }}
            closable={false}
            destroyOnClose
        >
            {children}
        </Drawer>
    );
};

export default LargeDrawer;
