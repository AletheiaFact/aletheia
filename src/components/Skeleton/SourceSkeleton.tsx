import { Grid, Skeleton } from "@mui/material";
import React from "react";
import styled from "styled-components";

const SkeletonGrid = styled(Grid)(() => ({
    '& .MuiSkeleton-root': {
        width: "100%",
        borderRadius: "10px",
    },
}));

const SourceSkeleton = () => {
    return (
        <Grid container style={{ marginTop: 14, width: "100%" }}>
            <SkeletonGrid xs={12}>
                <Skeleton
                    variant="rectangular"
                    style={{
                        width: "100%",
                        height: "156px",
                        borderRadius: "10px 10px 0 0 ",
                    }}
                />
                <Skeleton variant="text" width="30%" animation="wave" />
                <Skeleton variant="text" width="100%" animation="wave" />
                <Skeleton variant="text" width="60%" animation="wave" />
            </SkeletonGrid>
        </Grid>
    );
};

export default SourceSkeleton;
