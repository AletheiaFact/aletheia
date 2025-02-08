import { Grid, Skeleton } from "@mui/material";
import React from "react";

const PersonalitySkeleton = () => {
    return (
        <Grid container style={{ justifyContent: "center", marginBottom: 64 }}>
            <Grid item xs={2} style={{ paddingLeft: 20 }}>
                <Skeleton variant="circular" width={40} height={40} animation="wave" />
            </Grid>
            <Grid item xs={8}>
                <Skeleton variant="text" width="50%" animation="wave" />
                <Skeleton variant="text" width="75%" animation="wave" />
                <Skeleton variant="text" width="50%" animation="wave" />
            </Grid>
            <Grid item
                xs={2}
                style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    padding: "10px 0",
                }}
            >
                <Skeleton variant="rectangular" width={100} height={40} animation="wave" />
            </Grid>
        </Grid>
    );
};

export default PersonalitySkeleton;
