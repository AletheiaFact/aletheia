import React from "react";
import { useTranslations } from "next-intl";
import { useAtom } from "jotai";
import { currentUserRole } from "../atoms/currentUser";
import { Status } from "../types/enums";

const AcessDeniedPage = ({ originalUrl, status }) => {
    const tUnauthorized = useTranslations("unauthorized");
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
                {originalUrl
                    ? tUnauthorized("firstPartMessageURL")
                    : tUnauthorized("firstPartMessage")}
                {originalUrl === "/" ? "Home" : originalUrl}
                {tUnauthorized("secondPartMessage")}
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
                <h2>{tUnauthorized("inactiveAccountTitle")}</h2>
                <h3>{tUnauthorized("inactiveAccountBody")}</h3>
            </div>
        );
};

export default AcessDeniedPage;
