import { CloseOutlined, InfoOutlined } from "@mui/icons-material";
import { useTranslation } from "next-i18next";
import React from "react";
import colors from "../../../../../styles/colors";
import InfoTooltip from "../../../../Claim/InfoTooltip";

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
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 4,
                }}
            >
                {t("sourceForm:sourceModalHeader")}
                <InfoTooltip
                    useCustomStyle={false}
                    content={
                        <>
                            <strong style={{ display: "block", textTransform: "uppercase" }}>
                                {t("sourceForm:sourceModalTooltipTitle")}
                            </strong>
                            {t("sourceForm:sourceModalTooltip")}
                        </>
                    }
                    children={
                        <InfoOutlined
                            data-cy="testSourceModalTooltip"
                            style={{ height: 16, color: colors.neutralSecondary }}
                        />
                    }
                />
            </span>
        </header>
    );
};

export default SourceDialogHeader;
