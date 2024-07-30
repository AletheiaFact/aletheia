import React, { useContext } from "react";
import { Col } from "antd";
import AletheiaButton from "../Button";
import { useTranslation } from "next-i18next";
import AletheiaAlert from "../AletheiaAlert";
import { ReviewTaskMachineContext } from "../../machines/reviewTask/ReviewTaskMachineProvider";
import { publishedSelector } from "../../machines/reviewTask/selectors";
import { useSelector } from "@xstate/react";

const VerificationRequestAlert = ({ targetId, verificationRequestId }) => {
    const { t } = useTranslation();
    const { machineService, publishedReview } = useContext(
        ReviewTaskMachineContext
    );
    const isPublished =
        useSelector(machineService, publishedSelector) ||
        publishedReview?.review;

    const alertProps = {
        type: "warning",
        showIcon: !targetId,
        message: !targetId ? (
            t("verificationRequest:createClaimFromVerificationRequest")
        ) : (
            <div
                style={{
                    display: "flex",
                    gap: 16,
                    flexWrap: "wrap",
                    justifyContent: "space-around",
                }}
            >
                <span
                    style={{
                        height: "auto",
                        fontSize: 18,
                        lineHeight: "40px",
                        textAlign: "center",
                    }}
                >
                    {t("verificationRequest:openVerificationRequestClaimLabel")}
                </span>
                <AletheiaButton
                    href={`/claim/${targetId?.slug}`}
                    style={{ width: "fit-content" }}
                >
                    {t(
                        "verificationRequest:openVerificationRequestClaimButton"
                    )}
                </AletheiaButton>
            </div>
        ),
        description: !targetId ? (
            <AletheiaButton
                href={`/claim/create?verificationRequest=${verificationRequestId}`}
                style={{ width: "fit-content", marginTop: 32 }}
            >
                {t("seo:claimCreateTitle")}
            </AletheiaButton>
        ) : null,
    };

    return (
        <Col span={24}>{isPublished && <AletheiaAlert {...alertProps} />}</Col>
    );
};

export default VerificationRequestAlert;
