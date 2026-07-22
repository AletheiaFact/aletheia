import { CloseOutlined } from "@mui/icons-material";
import { useTranslations } from "next-intl";
import React from "react";

const SourceDialogHeader = ({ onCloseModal }) => {
    const tSourceForm = useTranslations("sourceForm");
    return (
        <header
            style={{
                display: "flex",
                alignItems: "center",
                fontWeight: "bold",
            }}
        >
            <button
                type="button"
                onClick={onCloseModal}
                style={{
                    border: "none",
                    background: "none",
                    padding: 2,
                    cursor: "pointer",
                }}
            >
                <CloseOutlined />
            </button>
            <span
                style={{
                    margin: 0,
                    width: "calc(100% - 16px)",
                    textAlign: "center",
                }}
            >
                {tSourceForm("sourceModalHeader")}
            </span>
        </header>
    );
};

export default SourceDialogHeader;
