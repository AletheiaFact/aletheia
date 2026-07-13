import { Divider } from "@mui/material";
import { useTranslations } from "next-intl";
import React from "react";

const EmptyKanbanGrid = ({ title }) => {
    const tList = useTranslations("list");
    return (
        <div
            style={{
                width: "100%",
                padding: "12px 0",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <span style={{ fontSize: 24 }}>{title}</span>

            <span>{tList("totalItems", { total: 0 })}</span>
            <Divider flexItem variant="middle" style={{ marginTop: 12 }} />
        </div>
    );
};

export default EmptyKanbanGrid;
