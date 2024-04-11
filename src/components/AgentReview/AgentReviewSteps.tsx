import React from "react";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";

const AgentReviewStep = ({
    label,
    stepIconComponent = null,
    ...props
}: {
    label: string;
    stepIconComponent?: any;
    key: string;
    color?: string;
    last?: boolean;
    completed?: boolean;
}) => {
    return (
        <Step {...props}>
            <StepLabel StepIconComponent={stepIconComponent}>{label}</StepLabel>
        </Step>
    );
};

export default AgentReviewStep;
