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
                    fontSize: "12px",
                    lineHeight: "16px",
                    height: "auto",
                    padding: "4px 12px",
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
                    height: 40,
                    paddingBottom: 0,
                }}
            >
                <AddOutlinedIcon />{" "}
                {isCreatingClaim
                    ? t("claimForm:personalityNotFound")
                    : t("personality:add_button")}
            </Button>
        );
    }
};

export default PersonalityCardButton;
