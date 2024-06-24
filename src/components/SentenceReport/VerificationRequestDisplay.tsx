import { Col, Row, Typography } from "antd";
import React, { useContext } from "react";
import VerificationRequestCard from "../VerificationRequest/VerificationRequestCard";
import { ReviewTaskMachineContext } from "../../machines/reviewTask/ReviewTaskMachineProvider";
import { publishedSelector } from "../../machines/reviewTask/selectors";
import { useSelector } from "@xstate/react";
import AletheiaButton from "../Button";
import { useTranslation } from "next-i18next";

const VerificationRequestDisplay = ({ content }) => {
    const { t } = useTranslation();
    const { machineService, publishedReview } = useContext(
        ReviewTaskMachineContext
    );
    const isPublished =
        useSelector(machineService, publishedSelector) ||
        publishedReview?.review;
    const { content: contentText } = content;

    return (
        <Row>
            {isPublished && (
                <Col
                    style={{
                        display: "flex",
                        gap: "16px",
                        flexDirection: "column",
                        justifyContent: "flex-end",
                        marginBottom: "32px",
                    }}
                >
                    <span>
                        {t(
                            "verificationRequest:createClaimFromVerificationRequest"
                        )}
                    </span>
                    <AletheiaButton
                        href={`/claim/create?verificationRequest=${content._id}`}
                        style={{ width: "fit-content" }}
                    >
                        {t("seo:claimCreateTitle")}
                    </AletheiaButton>
                </Col>
            )}
            <Col span={24}>
                <Typography.Title level={3}>
                    {t("verificationRequest:verificationRequestTitle")}
                </Typography.Title>
                <VerificationRequestCard content={contentText} />
            </Col>
        </Row>
    );
};

export default VerificationRequestDisplay;
