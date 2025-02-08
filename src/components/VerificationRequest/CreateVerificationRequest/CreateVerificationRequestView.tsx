import React from "react";
import { Grid } from "@mui/material";
import colors from "../../../styles/colors";
import DynamicVerificationRequestForm from "./DynamicVerificationRequestForm";

const CreateVerificationRequestView = () => {
    return (
        <Grid container justifyContent="center" style={{ background: colors.lightNeutral }}>
            <Grid item xs={9}>
                <DynamicVerificationRequestForm />
            </Grid>
        </Grid>
    );
};

export default CreateVerificationRequestView;
