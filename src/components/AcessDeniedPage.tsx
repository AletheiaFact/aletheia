import React from "react";
import { useTranslation } from "next-i18next";
import { useAtom } from "jotai";
import { currentUserRole } from "../atoms/currentUser";

const AcessDeniedPage = ({ originalUrl }) => {
    const [role] = useAtom(currentUserRole);

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
