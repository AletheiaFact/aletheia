import { Divider } from "antd";
import { useTranslation } from "next-i18next";
import React from "react";

const EmptyKanbanCol = ({ title }) => {
    const { t } = useTranslation();
    return (
        <div
            style={{
                width: "100%",
                padding: "12px 0",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <span
                style={{
                    fontSize: 24,
                }}
            >
                {title}
            </span>

            <span>
                {t("list:totalItems", {
                    total: 0,
                })}
            </span>
            <Divider
                style={{
                    marginTop: 12,
                }}
            />
        </div>
    );
};

export default EmptyKanbanCol;
