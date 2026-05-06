import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { useTranslation } from "next-i18next";
import React from "react";

import AletheiaButton, { ButtonType } from "../AletheiaButton";

const PersonalityCardButton = ({
    personality,
    personalityFoundProps,
    isFormSubmitted,
    personalityIsSelected,
    isCreatingClaim,
    onClick,
    isMobileDevice
}) => {
    const { t } = useTranslation();
    const buttonProps = {
        type: ButtonType.primary,
        "data-cy": personality.name,
        disabled: isFormSubmitted || personalityIsSelected,
    };

    if (personality?._id) {
        return (
            <AletheiaButton
                {...personalityFoundProps}
                {...buttonProps}
                style={{
                    fontSize: isMobileDevice ? "12px" : "12px",
                    padding: isMobileDevice ? "4px 8px" : "4px 12px",
                }}
            >
                <span>
                    {isCreatingClaim
                        ? t("claimForm:personalityFound")
                        : t("personality:profile_button")}
                </span>
            </AletheiaButton>
        );
    } else {
        return (
            <AletheiaButton
                {...buttonProps}
                startIcon={
                    <AddOutlinedIcon
                        style={{
                            fontSize: isMobileDevice ? "18px" : "24px"
                        }}
                    />
                }
                onClick={() => {
                    if (!isFormSubmitted) {
                        onClick(personality);
                    }
                }}
                style={{
                    fontSize: isMobileDevice ? "12px" : "14px",
                    padding: isMobileDevice ? "2px 8px" : "4px 12px",
                }}
            >
                {isCreatingClaim
                    ? t("claimForm:personalityNotFound")
                    : t("personality:add_button")}
            </AletheiaButton>
        );
    }
};

export default PersonalityCardButton;
