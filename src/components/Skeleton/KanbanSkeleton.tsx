import { Grid, Skeleton } from "@mui/material";
import React from "react";

const KanbanSkeleton = () => {
    return (
        <Grid item style={{ width: "95%" }}>
            <Skeleton variant="text" width="40%" animation="wave" />
            <Skeleton variant="text" width="100%" animation="wave" />
            <Grid item
                style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    padding: "10px 0",
                }}
            >
                <Skeleton variant="text" width="50%" animation="wave" />
            </Grid>
        </Grid>
    );
};

export default KanbanSkeleton;
