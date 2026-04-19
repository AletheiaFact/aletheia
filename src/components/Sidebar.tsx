import { Drawer } from "@mui/material";
import React from "react";
import { useDispatch } from "react-redux";
import actions from "../store/actions";
import { useAppSelector } from "../store/store";

import colors from "../styles/colors";

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
            anchor="top"
            variant="temporary"
            slotProps={{
                backdrop: {
                    sx: {
                        backgroundColor: "transparent",
                    },
                },
            }}
            sx={{
                "& .MuiDrawer-paper": {
                    marginTop: "64px",
                    width: "100%",
                    padding: "0",
                    backgroundColor: colors.primary,
                }
            }}
        >
            <div
                style={{
                    paddingTop: "16px",
                    paddingLeft: "48px",
                }}
            >

                {"teste"}
            </div>
        </Drawer>
    );
};

export default Sidebar;
