import { Grid, Skeleton } from "@mui/material";
import React from "react";

const ClaimSkeleton = () => {
    return (
        <Grid item
            sm={11}
            md={7}
            lg={6}
            style={{
                marginBottom: "10px",
            }}
        >
            <Skeleton variant="text" width="30%" animation="wave" />
            <Skeleton variant="text" width="100%" animation="wave" />
            <Skeleton variant="text" width="100%" animation="wave" />
            <Skeleton variant="text" width="100%" animation="wave" />
            <Skeleton variant="text" width="100%" animation="wave" />
            <Skeleton variant="text" width="100%" animation="wave" />
            <Skeleton variant="text" width="60%" animation="wave" />

            <Grid item
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "10px 0",
                }}
            >
                <Skeleton variant="text" width="50%" animation="wave" />
                <Skeleton variant="rectangular" width={60} height={30} animation="wave" />
            </Grid>
        </Grid>
    );
};

export default ClaimSkeleton;
