import React, { useContext, useMemo } from "react";
import { Col } from "antd";
import AletheiaButton from "../Button";
import { useTranslation } from "next-i18next";
import AletheiaAlert from "../AletheiaAlert";
import { ReviewTaskMachineContext } from "../../machines/reviewTask/ReviewTaskMachineProvider";
import { publishedSelector } from "../../machines/reviewTask/selectors";
import { useSelector } from "@xstate/react";
import { useAtom } from "jotai";
import { currentUserRole } from "../../atoms/currentUser";
import { Roles } from "../../types/enums";

const VerificationRequestAlert = ({ targetId, verificationRequestId }) => {
    const { t } = useTranslation();
    const [role] = useAtom(currentUserRole);
    const { machineService, publishedReview } = useContext(
        ReviewTaskMachineContext
    );
    const isPublished =
        useSelector(machineService, publishedSelector) ||
        publishedReview?.review;

    const shouldShowAlert = useMemo(() => {
        return (!targetId && isPublished && role !== Roles.Regular) || targetId;
    }, [targetId, isPublished, role]);

    const alertContent = useMemo(() => {
        if (!targetId && isPublished && role !== Roles.Regular) {
            return {
                type: "warning",
                showIcon: true,
                message: t(
                    "verificationRequest:createClaimFromVerificationRequest"
                ),
                description: (
                    <AletheiaButton
                        href={`/claim/create?verificationRequest=${verificationRequestId}`}
                        style={{ width: "fit-content", marginTop: 32 }}
                    >
                        {t("seo:claimCreateTitle")}
                    </AletheiaButton>
                ),
            };
        }
        if (targetId) {
            return {
                type: "warning",
                showIcon: false,
                message: (
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
                            {t(
                                "verificationRequest:openVerificationRequestClaimLabel"
                            )}
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
                description: null,
            };
        }
        return null;
    }, [targetId, isPublished, role, t, verificationRequestId]);

    if (!shouldShowAlert || !alertContent) {
        return null;
    }

    return (
        <Col span={24}>
            <AletheiaAlert {...alertContent} />
        </Col>
    );
};

export default VerificationRequestAlert;
