import { InfoOutlined, SecurityOutlined } from "@mui/icons-material";
import { Popover } from "antd";
import React from "react";
import colors from "../../styles/colors";
import { useTranslation } from "next-i18next";

const SentencePopover = () => {
    const { t } = useTranslation();

    const content = (
        <span
            style={{
                color: colors.primary,
                lineHeight: "20px",
                fontSize: 14,
                display: "flex",
                alignItems: "center",
                gap: 4,
            }}
        >
            <SecurityOutlined fontSize="small" />
            {t("reviewTask:sentenceInfo")}
        </span>
    );

    return (
        <Popover placement="top" content={content} trigger="hover">
            <InfoOutlined
                style={{ fontSize: "18px", color: colors.neutralSecondary }}
            />
        </Popover>
    );
};

export default SentencePopover;
