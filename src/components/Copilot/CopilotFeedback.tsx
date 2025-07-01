import React from "react";
import { Rating } from "@mui/material";
import colors from "../../styles/colors";
import { trackUmamiEvent } from "../../lib/umami";
import { useTranslation } from "react-i18next";

const CopilotFeedback = ({ setShowButtons }) => {
    const { t } = useTranslation();

    const handleChange = (rate) => {
        trackUmamiEvent(`copilot-rate: ${rate}`, "copilot");
        setShowButtons((prev) => ({
            ...prev,
            ADD_RATE: false,
        }));
    };

    return (
        <div
            style={{
                background: colors.white,
                borderRadius: "4px",
                gap: "8px",
                padding: "16px",
                margin: "16px 0",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <span style={{ fontSize: 12 }}>
                {t("copilotChatBot:rateQuestion")}
            </span>
            <Rating
                style={{ fontSize: 24, width: "fit-content" }}
                value={0}
                onChange={handleChange}
            />
        </div>
    );
};

export default CopilotFeedback;
