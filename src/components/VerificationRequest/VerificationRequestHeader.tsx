import { Grid, Typography } from "@mui/material"
import { useTranslations } from "next-intl";

const VerificationRequestHeader = () => {
    const tVerificationRequest = useTranslations("verificationRequest");
    return (
        <Grid item xs={11} md={5} className="verificationRequestHeader">
            <Typography variant="h1" className="headerTitle">
                {tVerificationRequest("verificationRequestListHeader")}
            </Typography>
            <Typography variant="body1" className="headerDescription">
                {tVerificationRequest("verificationRequestDescription")}
            </Typography>
        </Grid>
    )
}

export default VerificationRequestHeader
