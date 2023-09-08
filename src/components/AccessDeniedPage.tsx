import React from "react";
import { useTranslation } from "next-i18next";
import { useAtom } from "jotai";
import { currentUserRole } from "../atoms/currentUser";
import { Status } from "../types/enums";

const AcessDeniedPage = ({ originalUrl, status }) => {
    const { t } = useTranslation();
    const [role] = useAtom(currentUserRole);

    if (status !== Status.Inactive)
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
                {originalUrl === "/" ? "Home" : originalUrl}
                {t("unauthorized:secondPartMessage")}
                {role}
            </div>
        );
    else
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
                <h2>{t("unauthorized:inactiveAccountTitle")}</h2>
                <h3>{t("unauthorized:inactiveAccountBody")}</h3>
            </div>
        );
};

export default AcessDeniedPage;
