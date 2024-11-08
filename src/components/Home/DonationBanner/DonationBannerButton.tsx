import { useTranslation } from "next-i18next";
import Button from "../../Button";
import { trackUmamiEvent } from "../../../lib/umami";

const DonationBannerButton = ({ type }) => {
    const { t } = useTranslation();
    return (
        <Button
            type={type}
            href={t("home:donateUrlButton")}
            target="_blank"
            rel="noreferrer"
            onClick={() => {
                trackUmamiEvent("header-banner-donate-button", "Donate");
            }}
            className="banner-button"
        >
            {t("donationBanner:donateButton")}
        </Button>
    );
};

export default DonationBannerButton;
