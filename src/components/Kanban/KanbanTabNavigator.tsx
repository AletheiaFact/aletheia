import React from "react";
import { Grid, Tab } from "@mui/material";
import { NoteAdd, Report, Source } from "@mui/icons-material";
import TabsNavigatorStyle from "../adminArea/TabsNavigator.style";
import { useTranslations } from "next-intl";

const KanbanTabNavigator = ({ value, handleChange }) => {
    const tKanban = useTranslations("kanban");

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
                            <NoteAdd />
                            <span>{tKanban("tabClaimTitle")}</span>
                        </div>
                    }
                    {...tabProps(0)}
                />
                <Tab
                    label={
                        <div className="tab-label">
                            <Source />
                            <span>{tKanban("tabSourceTitle")}</span>
                        </div>
                    }
                    {...tabProps(1)}
                />
                <Tab
                    label={
                        <div className="tab-label">
                            <Report />
                            <span>
                                {tKanban("tabVerificationRequestTitle")}
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
