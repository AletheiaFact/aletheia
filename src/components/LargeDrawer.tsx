import { Drawer } from "@mui/material";
import React from "react";
import { useAppSelector } from "../store/store";
import colors from "../styles/colors";

const LargeDrawer = ({
    children,
    open,
    onClose,
    backgroundColor = colors.lightNeutral,
}) => {
    const { vw } = useAppSelector((state) => state);
    return (
        <Drawer
            open={open}
            onClose={onClose}
            anchor={vw?.sm ? "bottom" : "right"}
            variant="temporary"
            keepMounted={false}
            sx={{
                zIndex: 1000,
                "& .MuiDrawer-paper": {
                    width: vw?.sm ? "100%" : "60%",
                    height: vw?.sm ? "85%" : "100%",
                    backgroundColor,
                    padding: "0",

                }
            }}
        >
            {children}
        </Drawer>
    );
};

export default LargeDrawer;
