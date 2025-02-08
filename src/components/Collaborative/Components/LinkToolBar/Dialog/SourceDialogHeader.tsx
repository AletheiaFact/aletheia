import { CloseOutlined } from "@mui/icons-material";
import { useTranslation } from "next-i18next";
import React from "react";

const SourceDialogHeader = ({ onCloseModal }) => {
    const { t } = useTranslation();
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
                {t("sourceForm:sourceModalHeader")}
            </span>
        </header>
    );
};

export default SourceDialogHeader;
