import React from "react";
import { Grid } from "@mui/material";
import colors from "../../../styles/colors";
import DynamicSourceForm from "./DynamicSourceForm";

const CreateSourceView = () => {
    return (
        <Grid container justifyContent="center" style={{ background: colors.lightNeutral }}>
            <Grid item xs={9}>
                <DynamicSourceForm />
            </Grid>
        </Grid>
    );
};

export default CreateSourceView;
