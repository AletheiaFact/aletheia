import React, { useCallback, useEffect, useState } from "react";
import Tab from "@mui/material/Tab";
import { Grid } from "@mui/material";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import { useTranslation } from "next-i18next";
import TabsNavigatorStyle from "./TabsNavigator.style";
import SearchOverlay from "../Search/SearchOverlay";
import userApi from "../../api/userApi";

const AdminTabNavigator = ({ value, handleChange }) => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [totalUsers, setTotalUsers] = useState(0);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10,
    });
    const [searchName, setSearchName] = useState("");
    const [searchEmail, setSearchEmail] = useState("");
    const [applyFilters, setApplyFilters] = useState(false);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    function tabProps(index: number) {
        return {
            id: `simple-tab-${index}`,
            "aria-controls": `simple-tabpanel-${index}`,
        };
    }

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await userApi.getUsers(
                {
                    searchName,
                    searchEmail,
                    nameSpaceSlug: "",
                    canAssignUsers: false,
                },
                t
            );
            if (response) {
                setTotalUsers(response.total);
                setFilteredUsers(response.data);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    }, [
        paginationModel.page,
        paginationModel.pageSize,
        searchName,
        searchEmail,
    ]);

    useEffect(() => {
        if (isInitialLoad || applyFilters) {
            fetchData();
            if (isInitialLoad) setIsInitialLoad(false);
            setApplyFilters(false);
        }
    }, [applyFilters, fetchData, isInitialLoad]);

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
                            <span>{t("admin:tabUsersTitle")}</span>
                        </div>
                    }
                    {...tabProps(0)}
                />
                <Tab
                    label={
                        <div className="tab-label">
                            <DashboardOutlinedIcon />
                            <span>{t("admin:tabDashboardTitle")}</span>
                        </div>
                    }
                    {...tabProps(1)}
                />
            </TabsNavigatorStyle>
            <SearchOverlay />
        </Grid>
    );
};

export default AdminTabNavigator;
