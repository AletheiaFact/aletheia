import React, { useContext } from "react";
import VerificationRequestCard from "./VerificationRequestCard";
import { Col, Typography } from "antd";
import AletheiaButton from "../Button";
import { useTranslation } from "next-i18next";
import { VerificationRequestContext } from "./VerificationRequestProvider";
import VerificationRequestRecommendationsStyled from "./VerificationRequestRecommedations.style";

const VerificationRequestRecommendations = () => {
    const { t } = useTranslation();
    const { recommendations, addRecommendation } = useContext(
        VerificationRequestContext
    );

    return (
        <>
            {recommendations?.length > 0 && (
                <VerificationRequestRecommendationsStyled>
                    <Typography.Title level={4}>
                        {t("verificationRequest:recommendationTitle")}
                    </Typography.Title>
                    <div className="recommendation-list">
                        {recommendations?.length > 0 &&
                            recommendations.map((verificationRequest) => (
                                <Col style={{ width: "300px" }}>
                                    <VerificationRequestCard
                                        key={verificationRequest._id}
                                        content={verificationRequest.content}
                                        expandable={false}
                                        style={{ minHeight: "100%" }}
                                        actions={[
                                            <AletheiaButton
                                                onClick={() =>
                                                    addRecommendation(
                                                        verificationRequest
                                                    )
                                                }
                                            >
                                                {t(
                                                    "verificationRequest:recommendationTitle"
                                                )}
                                            </AletheiaButton>,
                                        ]}
                                    />
                                </Col>
                            ))}
                    </div>
                </VerificationRequestRecommendationsStyled>
            )}
        </>
    );
};

export default VerificationRequestRecommendations;
