import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import React from "react";

import AletheiaButton, { ButtonType } from "../AletheiaButton";
import { useTranslations } from "next-intl";

const PersonalityCardButton = ({
    personality,
    personalityFoundProps,
    isFormSubmitted,
    personalityIsSelected,
    isCreatingClaim,
    onClick,
    isMobileDevice
}) => {
    const tClaimForm = useTranslations("claimForm");
    const tPersonality = useTranslations("personality");
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
                        ? tClaimForm("personalityFound")
                        : tPersonality("profile_button")}
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
                    ? tClaimForm("personalityNotFound")
                    : tPersonality("add_button")}
            </AletheiaButton>
        );
    }
};

export default PersonalityCardButton;
