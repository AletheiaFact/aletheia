import { Drawer } from "@mui/material";
import React from "react";
import { useDispatch } from "react-redux";
import storeActions from "../../store/actions";
import { useAppSelector } from "../../store/store";
import colors from "../../styles/colors";
import SidebarContent from "./SidebarContent";

const Sidebar = () => {
    const dispatch = useDispatch();

    const { menuCollapsed } = useAppSelector((state) => ({
        menuCollapsed: state?.menuCollapsed ?? true,
    }));

    return (
        <Drawer
            open={!menuCollapsed}
            onClose={() => dispatch(storeActions.closeSideMenu())}
            anchor="top"
            variant="temporary"
            slotProps={{
                backdrop: { sx: { backgroundColor: "transparent" } },
            }}
            sx={{
                "& .MuiDrawer-paper": {
                    marginTop: "64px",
                    width: "100%",
                    padding: "0",
                    backgroundColor: colors.primary,
                    maxHeight: "calc(100vh - 64px)",
                    overflowY: "auto",
                }
            }}
        >
            <SidebarContent />
        </Drawer>
    );
};

export default Sidebar;
