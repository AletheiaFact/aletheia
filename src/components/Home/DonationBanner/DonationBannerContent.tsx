import React from "react";
import DonationBannerButton from "./DonationBannerButton";
import { ButtonType } from "../../AletheiaButton";
import { Grid } from "@mui/material";
import DonationBannerStyle from "./DonationBanner.style";
import { useTranslations } from "next-intl";

function DonationBannerContent({ closeClick }) {
    const tDonationBanner = useTranslations("donationBanner");
    const tHome = useTranslations("home");

    return (
        <DonationBannerStyle>
            <Grid item className="banner-content">
                <h1>{tDonationBanner("title")}</h1>
                <p>
                    {tDonationBanner.rich("paragraph", {
                        b: () => <b></b>
                    })}
                </p>
                <div className="banner-buttons">
                    <DonationBannerButton
                        type={ButtonType.white}
                        text={tDonationBanner("noDonateButton")}
                        closeClick={closeClick}
                        trackEvent={"banner-donate-button-no"}
                    />
                    <DonationBannerButton
                        type={ButtonType.primary}
                        href={tHome("donateUrlButton")}
                        text={tDonationBanner("yesDonateButton")}
                        closeClick={closeClick}
                        trackEvent={"banner-donate-button-yes"}
                    />
                </div>
            </Grid>
        </DonationBannerStyle>
    );
}

export default DonationBannerContent;
