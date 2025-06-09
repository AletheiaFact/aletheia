import { useTranslation } from "next-i18next";
import { trackUmamiEvent } from "../../lib/umami";
import Button, { ButtonType } from "../Button";
import { AletheiaModal } from "../Modal/AletheiaModal.style";
import colors from "../../styles/colors";
import { useState } from "react";
import AletheiaButton from "../Button";

interface CTAButtonProps {
    type?: string;
    isLoggedIn?: boolean;
    smallDevice?: boolean;
    mediumDevice?: boolean;
}

const CTAButton: React.FC<CTAButtonProps> = ({
    isLoggedIn,
    mediumDevice = false,
}) => {
    const { t } = useTranslation();
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleHideModal = () => {
        setIsModalVisible(false);
    };

    const handleClick = () => {
        trackUmamiEvent("cta-registration-button", "registration");

        if (isLoggedIn) {
            setIsModalVisible(true);
        }
    };

    return (
        <>
            <Button
                onClick={handleClick}
                type={ButtonType.white}
                href={!isLoggedIn ? "/sign-up" : undefined}
                className="CTA-registration-button"
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0 15px",
                    fontWeight: 600,
                    lineHeight: "16px",
                    textAlign: "center",
                    margin: "0 auto",
                    fontSize: mediumDevice ? "12px" : "14px",
                }}
            >
                {!isLoggedIn ? t("home:createAccountButton") : t("home:forumButton")}
            </Button>

            <AletheiaModal
                open={isModalVisible}
                onCancel={handleHideModal}
                title={
                    <h2
                        style={{
                            fontFamily: "open sans, sans-serif",
                            fontWeight: 700,
                            fontSize: 14,
                            textAlign: "center",
                            textTransform: "uppercase",
                            padding: "0 34px"
                        }}>
                        {t("home:redirectTitle")}
                    </h2>
                }
            >
                <p
                    style={{
                        fontWeight: 600,
                        width: "100%",
                        textAlign: "center",
                        color: colors.blackSecondary,
                    }}
                >
                    {t("home:descriptionAlert")}
                </p>

                <div
                    style={{
                        marginTop: 24,
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                    }}
                >
                    <AletheiaButton
                        type={ButtonType.blue}
                        onClick={handleHideModal}
                        href={"https://forum.aletheiafact.org/"}
                        target="_blank"
                        data-cy={"testButtonTutorialOk"}
                    >
                        {t("tutorial:okButton")}
                    </AletheiaButton>
                </div>
            </AletheiaModal>
        </>
    );
};

export default CTAButton;
