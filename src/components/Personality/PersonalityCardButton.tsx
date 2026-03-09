import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { useTranslation } from "next-i18next";
import React from "react";

import Button, { ButtonType } from "../Button";

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
        type: ButtonType.blue,
        "data-cy": personality.name,
        disabled: isFormSubmitted || personalityIsSelected,
    };

    if (personality?._id) {
        return (
            <Button
                {...personalityFoundProps}
                {...buttonProps}
                style={{
                    height: "auto",
                    fontSize: isMobileDevice ? "12px" : "14px",
                    padding: isMobileDevice ? "4px 6px" : "4px 12px",
                    textAlign: "center",
                    justifyContent: "center",
                }}
            >
                <span>
                    {isCreatingClaim
                        ? t("claimForm:personalityFound")
                        : t("personality:profile_button")}
                </span>
            </Button>
        );
    } else {
        return (
            <Button
                {...buttonProps}
                onClick={() => {
                    if (!isFormSubmitted) {
                        onClick(personality);
                    }
                }}
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "auto",
                    fontSize: isMobileDevice ? "12px" : "14px",
                    padding: isMobileDevice ? "2px 6px" : "4px 12px",
                }}
            >
                <AddOutlinedIcon style={{ margin: "0 3px 3px 0", fontSize: isMobileDevice ? "18px" : "24px", }} />
                {isCreatingClaim
                    ? t("claimForm:personalityNotFound")
                    : t("personality:add_button")}
            </Button>
        );
    }
};

export default PersonalityCardButton;
