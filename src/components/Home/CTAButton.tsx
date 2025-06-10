import { useTranslation } from "next-i18next";
import { trackUmamiEvent } from "../../lib/umami";
import Button, { ButtonType } from "../Button";
import { useState } from "react";
import ForumAlertModal from "../Modal/ForumAlertModal";

interface CTAButtonProps {
    type?: string;
    isLoggedIn?: boolean;
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

            {isModalVisible && (
                <ForumAlertModal open={isModalVisible} onCancel={handleHideModal} />
            )
            }
        </>
    )
}

export default CTAButton;
