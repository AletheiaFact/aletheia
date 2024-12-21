import React from "react";
import DonationBannerButton from "./DonationBannerButton";
import { ButtonType } from "../../Button";
import { Grid } from "@mui/material";
import { Trans, useTranslation } from "next-i18next";
import DonationBannerStyle from "../DonationBanner.style";

function DonationBannerContent({ closeClick }) {
    const { t } = useTranslation();
    return (
        <DonationBannerStyle>
            <Grid item className="banner-content">
                <h1>{t("donationBanner:title")}</h1>
                <p>
                    <Trans i18nKey="donationBanner:paragraph" />
                </p>
                <div className="banner-buttons">
                    <DonationBannerButton
                        type={ButtonType.white}
                        text={t("donationBanner:noDonateButton")}
                        closeClick={closeClick}
                        trackEvent={"banner-donate-button-no"}
                    />
                    <DonationBannerButton
                        type={ButtonType.blue}
                        href={t("home:donateUrlButton")}
                        text={t("donationBanner:yesDonateButton")}
                        closeClick={closeClick}
                        trackEvent={"banner-donate-button-yes"}
                    />
                </div>
            </Grid>
        </DonationBannerStyle>
    );
}

export default DonationBannerContent;
