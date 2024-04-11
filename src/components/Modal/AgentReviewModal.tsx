import React, { useEffect, useRef, useState } from "react";
import { Col } from "antd";
import { useTranslation } from "next-i18next";
import AletheiaCaptcha from "../AletheiaCaptcha";
import Button, { ButtonType } from "../Button";
import AutomatedFactCheckingSteps from "../AgentReview/AutomatedFactCheckingSteps";
import { AletheiaModal } from "./AletheiaModal.style";
import {
    ReviewTaskEvents,
    ReviewTaskStates,
} from "../../machines/reviewTask/enums";
import { useRouter } from "next/router";
import { useAtom } from "jotai";
import { currentNameSpace } from "../../atoms/namespace";
import api from "../../api/ClaimReviewTaskApi";
import AutomatedFactCheckingApi from "../../api/AutomatedFactCheckingApi";
import StepConnector from "@mui/material/StepConnector";
import { currentUserId } from "../../atoms/currentUser";
import AgentReviewStep from "../AgentReview/AgentReviewSteps";
import { ReviewData } from "../../machines/reviewTask/events";

interface AgentMessage {
    can_be_fact_checked: boolean;
    isFinalAnswer: string;
    response: string | object;
    step_description: string;
}

const AgentReviewModal = ({
    sentence,
    visible,
    handleCancel,
    claimId,
    personalityId,
    dataHash,
}: {
    sentence: string;
    visible: boolean;
    handleCancel: () => void;
    claimId: string;
    personalityId: string;
    dataHash: string;
}) => {
    const { t } = useTranslation();
    const router = useRouter();
    const [nameSpace] = useAtom(currentNameSpace);
    const [userId] = useAtom(currentUserId);

    const [isShowingSteps, setIsShowingSteps] = useState<boolean>(false);
    const [agentSteps, setAgentSteps] = useState<React.ReactNode[]>([]);
    const [activeAgentStep, setActiveAgentStep] = useState<number>(0);
    const [isStepFinished, setIsStepFinished] = useState<boolean>(false);
    const [reviewData, setReviewData] = useState<ReviewData>(null);
    const [recaptchaString, setRecaptchaString] = useState<string>("");
    const hasCaptcha: boolean = !!recaptchaString;
    const recaptchaRef = useRef(null);
    const intervalIdRef = useRef(null);

    useEffect(() => {
        const getChainOfThought = async (): Promise<void> => {
            if (visible && !reviewData) {
                const stepInterval: number = 3000;
                let index: number = 1;
                setIsShowingSteps(true);
                /**
                 * TODO: Abort API call in case recall before completion
                 * to prevent many API requests
                 */
                const {
                    messages: agentMessages,
                }: { messages: AgentMessage[] } =
                    await AutomatedFactCheckingApi.createClaimReviewTaskUsingAIAgents(
                        {
                            sentence: t("claimReviewForm:agentInputText", {
                                sentence,
                            }),
                        }
                    );

                const steps = agentMessages.map(({ step_description }) => (
                    <AgentReviewStep
                        label={step_description}
                        key={step_description.trim()}
                    />
                ));

                if (steps.length > 0) {
                    setAgentSteps([<StepConnector />, steps[index - 1]]);
                }

                intervalIdRef.current = setInterval(() => {
                    if (index < steps.length) {
                        setAgentSteps((rest) => [...rest, steps[index]]);
                    } else {
                        finalizeReviewProcess(
                            agentMessages[agentMessages.length - 1]
                        );
                        clearInterval(intervalIdRef.current as NodeJS.Timer);
                    }
                    setActiveAgentStep(index);
                    index++;
                }, stepInterval);
            }
        };

        getChainOfThought();

        return () => {
            clearInterval(intervalIdRef.current);
        };
    }, [visible]);

    const finalizeReviewProcess = async ({
        can_be_fact_checked,
        response: reviewData,
    }: {
        can_be_fact_checked: boolean;
        response: any;
    }) => {
        if (can_be_fact_checked) {
            setReviewData({
                ...reviewData,
                usersId: [userId],
                classification: reviewData.classification.toLowerCase(),
                sources: [],
            });
            setAgentSteps((rest) => {
                return [
                    ...rest,
                    <AgentReviewStep
                        label={t("claimReviewForm:agentFinishedReport")}
                        last={true}
                        completed={true}
                        key={t("claimReviewForm:agentFinishedReport").trim()}
                    />,
                ];
            });
        } else {
            setAgentSteps((_first, ...rest) => [
                ...rest,
                <AgentReviewStep
                    label={reviewData}
                    key={reviewData}
                    color="error"
                />,
            ]);
        }
        setIsStepFinished(true);
        setActiveAgentStep((index) => index + 1);
    };

    const submitReport = async (): Promise<void> => {
        const claimReviewTask = {
            data_hash: dataHash,
            machine: {
                context: {
                    reviewData,
                    claimReview: {
                        usersId: [userId],
                        data_hash: dataHash,
                        personality: personalityId,
                        claim: claimId,
                    },
                },
                value: ReviewTaskStates.assigned,
            },
            recaptcha: recaptchaString,
            nameSpace,
        };

        await api.createClaimReviewTask(
            claimReviewTask,
            t,
            ReviewTaskEvents.finishReport
        );
        router.reload();
    };

    return (
        <AletheiaModal
            className="ant-modal-content"
            open={visible}
            footer={false}
            onCancel={handleCancel}
            width={"80%"}
            title={t("claimReviewForm:addAgentReviewModalTitle")}
        >
            <div
                style={{
                    marginTop: 16,
                    display: "flex",
                    width: "100%",
                    justifyContent: "center",
                }}
            >
                {isShowingSteps && (
                    <AutomatedFactCheckingSteps
                        steps={agentSteps}
                        activeStep={activeAgentStep}
                        isStepFinished={isStepFinished}
                    />
                )}
            </div>

            {isStepFinished && (
                <Col
                    style={{
                        margin: "32px 0",
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-around",
                        gap: "16px",
                    }}
                >
                    <AletheiaCaptcha
                        onChange={setRecaptchaString}
                        ref={recaptchaRef}
                    />

                    <Col>
                        <Button
                            type={ButtonType.blue}
                            data-cy={"testSubmitAgentReviewButton"}
                            disabled={!hasCaptcha}
                            onClick={submitReport}
                        >
                            {t("claimReviewForm:submitAgentReview")}
                        </Button>
                    </Col>
                </Col>
            )}
        </AletheiaModal>
    );
};

export default AgentReviewModal;
