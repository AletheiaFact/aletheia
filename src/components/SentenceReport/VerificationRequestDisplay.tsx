import { Col, Typography } from "antd";
import React from "react";
import VerificationRequestCard from "../VerificationRequest/VerificationRequestCard";
import { useTranslation } from "next-i18next";
import VerificationRequestCardDisplayStyle from "./VerificationRequestDisplay.style";
import { useAppSelector } from "../../store/store";
import VerificationRequestAlert from "../VerificationRequest/VerificationRequestAlert";

const VerificationRequestDisplay = ({ content }) => {
    const { t } = useTranslation();
    const { vw } = useAppSelector((state) => state);
    const { content: contentText, group } = content;
    const verificationRequestGroup = group.content.filter(
        (c) => c._id !== content._id
    );

    return (
        <VerificationRequestCardDisplayStyle>
            <VerificationRequestAlert
                targetId={content?.group?.targetId}
                verificationRequestId={content._id}
            />

            <Col lg={17} md={24}>
                <Typography.Title level={3}>
                    {t("verificationRequest:verificationRequestTitle")}
                </Typography.Title>
                <VerificationRequestCard content={contentText} />
            </Col>
            {!vw.xs && (
                <Col offset={!vw?.md ? 1 : 0} lg={6} md={24}>
                    <Typography.Title level={4}>
                        {t("verificationRequest:agroupVerificationRequest")}
                    </Typography.Title>
                    <div
                        style={{
                            display: "flex",
                            gap: 32,
                            justifyContent: "space-between",
                            flexWrap: "wrap",
                        }}
                    >
                        {verificationRequestGroup.map(({ content }) => (
                            <div
                                style={{ flex: "1 1 200px", minWidth: "200px" }}
                            >
                                <VerificationRequestCard content={content} />
                            </div>
                        ))}
                    </div>
                </Col>
            )}
        </VerificationRequestCardDisplayStyle>
    );
};

export default VerificationRequestDisplay;
