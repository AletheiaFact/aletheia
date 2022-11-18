import React from "react";
import { useTranslation } from "next-i18next";
import { useAppSelector } from "../store/store";

const AcessDeniedPage = ({ originalUrl }) => {
    const { role } = useAppSelector((state) => state);
    const { t } = useTranslation();
    return (
        <div
            style={{
                width: "100%",
                marginTop: "60px",
                textAlign: "center",
                fontSize: "1rem",
                fontWeight: 600,
            }}
        >
            {t("unauthorized:firstPartMessage")}
            {originalUrl}
            {t("unauthorized:secondPartMessage")}
            {role}
        </div>
    );
};

export default AcessDeniedPage;
