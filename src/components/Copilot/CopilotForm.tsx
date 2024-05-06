import React, { useState } from "react";
import AletheiaTextAreaAutoSize from "../TextAreaAutoSize";
import colors from "../../styles/colors";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

const CopilotForm = ({ addMessage }) => {
    const [message, setMessage] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        setMessage("");
        addMessage({ content: message, sender: "You" });
    };

    return (
        <form
            onSubmit={handleSubmit}
            style={{
                width: "100%",
                display: "flex",
                alignItems: "flex-end",
                padding: "8px",
                gap: 8,
                background: colors.grayTertiary,
                borderRadius: 4,
            }}
        >
            <AletheiaTextAreaAutoSize
                value={message}
                placeholder="Escreva uma mensagem"
                onChange={({ target }) => setMessage(target.value)}
            />
            <button
                style={{
                    width: 24,
                    height: 44,
                    padding: 0,
                    background: "none",
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                }}
            >
                <ArrowUpwardIcon />
            </button>
        </form>
    );
};

export default CopilotForm;
