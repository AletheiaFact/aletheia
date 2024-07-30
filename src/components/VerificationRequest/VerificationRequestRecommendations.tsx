import React, { useContext } from "react";
import { Typography } from "antd";
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
                    <Typography.Title level={4}>
                        {t("verificationRequest:recommendationTitle")}
                    </Typography.Title>
                    <VerificationRequestResultList results={recommendations} />
                </section>
            )}
        </>
    );
};

export default VerificationRequestRecommendations;
