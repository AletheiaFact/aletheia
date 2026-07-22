import React from "react";
import { Grid, Typography } from "@mui/material";
import CTAFolderActions from "./CTAFolderActions";
import { useTranslations } from "next-intl";

type CTAFolderMainColumnProps = {
    isHomeFolder?: boolean;
};

const CTAFolderMainColumn = ({ isHomeFolder = false }: CTAFolderMainColumnProps) => {
    const tCTAFolder = useTranslations("CTAFolder");

    return (
        <Grid item className="ctaMainColumn">
            <Typography
                variant="h2"
                className="ctaTitle"
            >
                {tCTAFolder("aboutUsTitle")}
            </Typography>
            <Typography
                variant="body1"
                className="ctaBody"
            >
                {tCTAFolder("aboutUsBody")}
            </Typography>
            <CTAFolderActions isHomeFolder={isHomeFolder} />
        </Grid>
    );
};

export default CTAFolderMainColumn;
