import React from "react";
import Tab from "@mui/material/Tab";
import { Grid } from "@mui/material";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import TabsNavigatorStyle from "./TabsNavigator.style";
import { useTranslations } from "next-intl";

const AdminTabNavigator = ({ value, handleChange }) => {
    const tAdmin = useTranslations("admin");

    function tabProps(index: number) {
        return {
            id: `simple-tab-${index}`,
            "aria-controls": `simple-tabpanel-${index}`,
        };
    }

    return (
        <Grid item xs={10} sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabsNavigatorStyle
                value={value}
                onChange={handleChange}
                aria-label="Aletheia admin tabs"
            >
                <Tab
                    label={
                        <div className="tab-label">
                            <ManageAccountsOutlinedIcon />
                            <span>{tAdmin("tabUsersTitle")}</span>
                        </div>
                    }
                    {...tabProps(0)}
                />
                <Tab
                    label={
                        <div className="tab-label">
                            <DashboardOutlinedIcon />
                            <span>{tAdmin("tabDashboardTitle")}</span>
                        </div>
                    }
                    {...tabProps(1)}
                />
            </TabsNavigatorStyle>
        </Grid>
    );
};

export default AdminTabNavigator;
