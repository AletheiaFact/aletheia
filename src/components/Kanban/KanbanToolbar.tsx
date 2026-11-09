import React from "react";
import { useTranslation } from "next-i18next";

import { Box, Button, FormControlLabel, Switch, Grid } from "@mui/material";
import DateRangePicker from "../DateRangePicker";

const KanbanToolbar = ({
    filterUserTasks,
    setFilterUserTasks,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
}) => {
    const { t } = useTranslation();

    const handleChange = (selectedTask) => {
        setFilterUserTasks((prev) => ({
            ...Object.keys(prev).reduce((acc, key) => {
                acc[key] = false;
                return acc;
            }, {}),
            [selectedTask]: !prev[selectedTask],
        }));
    };

    const handleClearDates = () => {
        setStartDate(null);
        setEndDate(null);
    };

    return (
        <Grid item xs={12} className="kanban-toolbar">
            <Box
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    gap: "8px",
                }}
            >
                {Object.keys(filterUserTasks).map((task) => (
                    <FormControlLabel
                        key={task}
                        control={
                            <Switch
                                checked={filterUserTasks[task]}
                                onChange={() => handleChange(task)}
                            />
                        }
                        label={t(
                            `kanban:my${
                                task.charAt(0).toUpperCase() + task.slice(1)
                            }`
                        )}
                    />
                ))}
                <DateRangePicker
                    startDate={startDate}
                    endDate={endDate}
                    setStartDate={setStartDate}
                    setEndDate={setEndDate}
                />
                {(startDate || endDate) && (
                    <Button size="small" onClick={handleClearDates}>
                        {t("kanban:clearDates")}
                    </Button>
                )}
            </Box>
        </Grid>
    );
};

export default KanbanToolbar;
