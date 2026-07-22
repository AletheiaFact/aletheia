import React, { useState } from "react";
import AletheiaTextAreaAutoSize from "../TextAreaAutoSize";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { SenderEnum } from "../../types/enums";
import { useTranslations } from "next-intl";

//TODO: Implement React Hook forms
const CopilotForm = ({ handleSendMessage }) => {
    const tCopilotChatBot = useTranslations("copilotChatBot");
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
                style={{ maxHeight: "400px", minHeight: "44px" }}
                value={message}
                placeholder={tCopilotChatBot("inputPlaceholder")}
                onChange={({ target }) => setMessage(target.value)}
                white={"true"}
                onKeyDown={(e) => {
                    if (!e.shiftKey && e.key === "Enter") {
                        handleSubmit(e);
                    }
                }}
            />
            <button onClick={handleSubmit} className="submit-message-button">
                <ArrowUpwardIcon />
            </button>
        </form>
    );
};

export default CopilotForm;
