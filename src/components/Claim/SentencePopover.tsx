import { InfoCircleOutlined, SecurityScanOutlined } from "@ant-design/icons";
import { Popover } from "antd";
import React from "react";
import colors from "../../styles/colors";
import { useTranslation } from "next-i18next";

const SentencePopover = () => {
    const { t } = useTranslation();

    const content = (
        <span
            style={{
                color: colors.bluePrimary,
                lineHeight: "20px",
                fontSize: 14,
                display: "flex",
                alignItems: "center",
                gap: 4,
            }}
        >
            <SecurityScanOutlined style={{ fontSize: 20 }} />
            {t("reviewTask:sentenceInfo")}
        </span>
    );

    return (
        <Popover placement="top" content={content} trigger="hover">
            <InfoCircleOutlined style={{ color: colors.graySecondary }} />
        </Popover>
    );
};

export default SentencePopover;
