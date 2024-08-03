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
            style={{
                alignItems: "center",
                justifyContent: "center",
                height: "max-content",
                fontWeight: 700,
                whiteSpace: "normal",
                lineHeight: "20px",

            }}
        >
            <span style={{ padding: "6px 0px" }}>
                {t("CTARegistration:button")}
            </span>
        </Button>
    );
};

export default CTAButton;
