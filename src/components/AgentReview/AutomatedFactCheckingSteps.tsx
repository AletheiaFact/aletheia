import React from "react";
import { LoadingOutlined } from "@ant-design/icons";
import Stepper from "@mui/material/Stepper";
import { StepConnector } from "@mui/material";
import { useTranslation } from "next-i18next";
import AgentReviewStep from "./AgentReviewSteps";

const AutomatedFactCheckingSteps = ({
    steps,
    activeStep,
    isStepFinished,
}: {
    steps: any;
    activeStep: number;
    isStepFinished: boolean;
}) => {
    const { t } = useTranslation();

    return (
        <Stepper
            activeStep={activeStep}
            orientation="vertical"
            connector={<StepConnector />}
        >
            {!isStepFinished ? (
                <AgentReviewStep
                    label={t("claimReviewForm:agentLoadingThoughts")}
                    stepIconComponent={LoadingOutlined}
                    key="thinking"
                />
            ) : (
                <AgentReviewStep
                    label={t("claimReviewForm:agentFinishedThoughts")}
                    key={"completed"}
                    completed={true}
                />
            )}
            {steps.map((stepComponent, index) =>
                React.cloneElement(stepComponent, {
                    key: `step-${index}`,
                    index: index - 1,
                })
            )}
        </Stepper>
    );
};

export default AutomatedFactCheckingSteps;
