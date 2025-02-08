import React, { useContext } from "react";
import { Typography } from "@mui/material";
import { useTranslation } from "next-i18next";
import { VerificationRequestContext } from "./VerificationRequestProvider";
import VerificationRequestResultList from "./VerificationRequestResultList";

const VerificationRequestRecommendations = () => {
    const { t } = useTranslation();
    const { recommendations } = useContext(VerificationRequestContext);

    return (
        <>
            {recommendations?.length > 0 && (
                <section style={{ width: "100%" }}>
                    <Typography style={{ fontFamily: "serif", fontWeight: 600, fontSize: 26, lineHeight: 1.35 }} variant="h4">
                        {t("verificationRequest:recommendationTitle")}
                    </Typography>
                    <VerificationRequestResultList results={recommendations} />
                </section>
            )}
        </>
    );
};

export default VerificationRequestRecommendations;
