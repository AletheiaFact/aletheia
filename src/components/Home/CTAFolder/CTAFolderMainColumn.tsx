import React from "react";
import { Grid, Typography } from "@mui/material";
import { useTranslation } from "next-i18next";
import CTAFolderActions from "./CTAFolderActions";

type CTAFolderMainColumnProps = {
    isLoggedIn: boolean;
};

const CTAFolderMainColumn = ({ isLoggedIn }: CTAFolderMainColumnProps) => {
    const { t } = useTranslation();
    const title = isLoggedIn ? t("CTAFolder:aboutUsTitle") : t("CTAFolder:signUpTitle");
    const body = isLoggedIn ? t("CTAFolder:aboutUsBody") : t("CTAFolder:signUpBody");

    return (
        <Grid item className="ctaMainColumn">
            <Typography
                variant="h2"
                className="ctaTitle"
            >
                {title}
            </Typography>
            <Typography
                variant="body1"
                className="ctaBody"
            >
                {body}
            </Typography>
            {!isLoggedIn && (
                <Typography
                    variant="body1"
                    className="ctaFooter"
                >
                    {t("CTAFolder:signUpFooter")}
                </Typography>
            )}
            <CTAFolderActions isLoggedIn={isLoggedIn} />
        </Grid>
    );
};

export default CTAFolderMainColumn;
