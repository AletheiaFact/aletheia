import { useTranslation } from "next-i18next";
import Button from "../../Button";

const DonationBannerButton = ({ type }) => {
    const { t } = useTranslation();
    return (
        <Button
            type={type}
            href={t("home:donateUrlButton")}
            className="banner-button"
        >
            {t("donationBanner:donateButton")}
        </Button>
    );
};

export default DonationBannerButton;
