import { useTranslation } from "next-i18next";
import { trackUmamiEvent } from "../../lib/umami";
import Button from "../Button";

const CTAButton = ({ type }) => {
    const { t } = useTranslation();
    return (
        <Button
            onClick={() => {
                trackUmamiEvent("cta-registration-button", "registration");
            }}
            type={type}
            href={"/sign-up"}
            className="CTA-registration-button"
            rounded="true"
            style={{
                alignItems: "center",
                justifyContent: "center",
                height: "40px",
                padding: "0 15px",
                fontWeight: 700,
            }}
        >
            {t("CTARegistration:button")}
        </Button>
    );
};

export default CTAButton;
