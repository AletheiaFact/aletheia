import React, { useState } from "react";
import AletheiaTextAreaAutoSize from "../TextAreaAutoSize";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { SenderEnum } from "../../types/enums";
import { useTranslation } from "next-i18next";

//TODO: Implement React Hook forms
const CopilotForm = ({ handleSendMessage }) => {
    const { t } = useTranslation();
    const [message, setMessage] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        handleSendMessage({
            sender: SenderEnum.User,
            content: message,
        });
        setMessage("");
    };

    return (
        <form className="copilot-form" onSubmit={handleSubmit}>
            <AletheiaTextAreaAutoSize
                style={{ maxHeight: "400px", minHeight: "100px" }}
                value={message}
                placeholder={t("copilotChatBot:inputPlaceholder")}
                onChange={({ target }) => setMessage(target.value)}
                white={"true"}
                onKeyDown={(e) => {
                    if (!e.shiftKey && e.key === "Enter") {
                        handleSubmit(e);
                    }
                }}
            />
            <button className="submit-message-button">
                <ArrowUpwardIcon />
            </button>
        </form>
    );
};

export default CopilotForm;
