import React from "react";
import { Grid, Typography } from "@mui/material";
import { useTranslation } from "next-i18next";
import CTAFolderActions from "./CTAFolderActions";

type CTAFolderMainColumnProps = {
    isHomeFolder?: boolean;
};

const CTAFolderMainColumn = ({ isHomeFolder = false }: CTAFolderMainColumnProps) => {
    const { t } = useTranslation();

    return (
        <Grid item className="ctaMainColumn">
            <Typography
                variant="h2"
                className="ctaTitle"
            >
                {t("CTAFolder:aboutUsTitle")}
            </Typography>
            <Typography
                variant="body1"
                className="ctaBody"
            >
                {t("CTAFolder:aboutUsBody")}
            </Typography>
            <CTAFolderActions isHomeFolder={isHomeFolder} />
        </Grid>
    );
};

export default CTAFolderMainColumn;
