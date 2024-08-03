import React from "react";
import Tab from "@mui/material/Tab";
import { Grid } from "@mui/material";
import ReportIcon from "@mui/icons-material/Report";
import { useTranslation } from "next-i18next";
import TabsNavigatorStyle from "../adminArea/TabsNavigator.style";
import SourceIcon from "@mui/icons-material/Source";
import { FileAddFilled } from "@ant-design/icons";

const KanbanTabNavigator = ({ value, handleChange }) => {
    const { t } = useTranslation();

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
                aria-label="Aletheia kanban tabs"
            >
                <Tab
                    label={
                        <div className="tab-label">
                            <FileAddFilled />
                            <span>{t("kanban:tabClaimTitle")}</span>
                        </div>
                    }
                    {...tabProps(0)}
                />
                <Tab
                    label={
                        <div className="tab-label">
                            <SourceIcon />
                            <span>{t("kanban:tabSourceTitle")}</span>
                        </div>
                    }
                    {...tabProps(1)}
                />
                <Tab
                    label={
                        <div className="tab-label">
                            <ReportIcon />
                            <span>
                                {t("kanban:tabVerificationRequestTitle")}
                            </span>
                        </div>
                    }
                    {...tabProps(2)}
                />
            </TabsNavigatorStyle>
        </Grid>
    );
};

export default KanbanTabNavigator;
