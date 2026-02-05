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
                <section className="container">
                    <Typography className="title" variant="h1">
                        {t("verificationRequest:recommendationTitle")}
                    </Typography>
                    <VerificationRequestResultList results={recommendations} />
                </section>
            )}
        </>
    );
};

export default VerificationRequestRecommendations;
