import React, { useContext } from "react";
import { Typography } from "@mui/material";
import { VerificationRequestContext } from "./VerificationRequestProvider";
import VerificationRequestResultList from "./VerificationRequestResultList";
import { useTranslations } from "next-intl";

const VerificationRequestRecommendations = () => {
    const tVerificationRequest = useTranslations("verificationRequest");
    const { recommendations } = useContext(VerificationRequestContext);

    return (
        <>
            {recommendations?.length > 0 && (
                <section className="container">
                    <Typography className="title" variant="h1">
                        {tVerificationRequest("recommendationTitle")}
                    </Typography>
                    <VerificationRequestResultList results={recommendations} />
                </section>
            )}
        </>
    );
};

export default VerificationRequestRecommendations;
