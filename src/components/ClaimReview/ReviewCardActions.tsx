import React, { useState } from "react";
import AletheiaButton, { ButtonType } from "../Button";
import colors from "../../styles/colors";
import ClassificationText from "../ClassificationText";
import { useTranslation } from "next-i18next";

const ClaimReviewCardActions = ({ href, content }) => {
    const { t } = useTranslation();
    const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false);
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "8px",
                width: "100%",
            }}
        >
            <span>
                {t("claimReview:claimReview")}
                <ClassificationText
                    classification={content.props.classification}
                />
            </span>
            <AletheiaButton
                type={ButtonType.blue}
                href={href}
                onClick={() => setIsButtonLoading(true)}
                loading={isButtonLoading}
            >
                <span
                    style={{
                        color: colors.white,
                        fontSize: 12,
                        fontWeight: 400,
                        margin: 0,
                        padding: 0,
                        lineHeight: "24px",
                    }}
                >
                    {t("home:reviewsCarouselOpen")}
                </span>
            </AletheiaButton>
        </div>
    );
};

export default ClaimReviewCardActions;