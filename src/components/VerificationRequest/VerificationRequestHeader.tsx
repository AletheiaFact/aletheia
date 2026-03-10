import { Grid, Typography } from "@mui/material"
import { useTranslation } from "next-i18next";

const VerificationRequestHeader = () => {
    const { t } = useTranslation();
    return (
        <Grid item xs={11} md={5} className="verificationRequestHeader">
            <Typography variant="h1" className="headerTitle">
                {t("verificationRequest:verificationRequestListHeader")}
            </Typography>
            <Typography variant="body1" className="headerDescription">
                {t("verificationRequest:verificationRequestDescription")}
            </Typography>
        </Grid>
    )
}

export default VerificationRequestHeader
