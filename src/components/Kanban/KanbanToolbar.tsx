import React from "react";
import { useTranslation } from "next-i18next";

import { FormControlLabel, Switch, Grid } from "@mui/material";

const KanbanToolbar = ({ filterUserTasks, setFilterUserTasks }) => {
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

    return (
        <Grid item xs={12} className="kanban-toolbar">
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
        </Grid>
    );
};

export default KanbanToolbar;
