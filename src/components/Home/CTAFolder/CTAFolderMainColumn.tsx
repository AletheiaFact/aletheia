import React from "react";
import { Grid, Typography } from "@mui/material";
import CTAFolderActions from "./CTAFolderActions";
import { useTranslations } from "next-intl";

type CTAFolderMainColumnProps = {
    isLoggedIn: boolean;
    isHomeFolder?: boolean;
};

const CTAFolderMainColumn = ({ isLoggedIn, isHomeFolder = true }: CTAFolderMainColumnProps) => {
    const tCTAFolder = useTranslations("CTAFolder");
    const title = isLoggedIn ? tCTAFolder("aboutUsTitle") : tCTAFolder("signUpTitle");
    const body = isLoggedIn ? tCTAFolder("aboutUsBody") : tCTAFolder("signUpBody");

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
                    className="ctaBody"
                >
                    {tCTAFolder("signUpFooter")}
                </Typography>
            )}
            <CTAFolderActions isLoggedIn={isLoggedIn} isHomeFolder={isHomeFolder} />
        </Grid>
    );
};

export default CTAFolderMainColumn;
