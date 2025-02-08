import { Grid } from "@mui/material";
import React from "react";

const SkeletonList = ({ listItem, repeat }) => {
    return (
        <Grid container spacing={5} style={{ marginTop: 32 }}>
            {[...Array(repeat)].map((_item, index) => (
                <React.Fragment key={index}>{listItem}</React.Fragment>
            ))}
        </Grid>
    );
};

export default SkeletonList;
