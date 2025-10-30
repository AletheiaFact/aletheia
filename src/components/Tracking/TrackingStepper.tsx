import * as React from "react";
import { Step, Stepper } from "@mui/material";
import { VerificationRequestStatus } from "../../../server/verification-request/dto/types";
import { TrackingResponseDTO } from "../../types/Tracking";
import TrackingStep from "./TrackingStep";

const ALL_STEPS = Object.values(VerificationRequestStatus || "");

const TrackingStepper: React.FC<TrackingResponseDTO> = ({
  currentStatus,
  historyEvents,
}) => {
  const getDateForStep = (stepStatus: string) => {
    const history = historyEvents.find(history => history.status === stepStatus);
    return history ? new Date(history.date) : null;
  };

  const isRequestDeclined = currentStatus === VerificationRequestStatus.DECLINED;

  let dynamicSteps: string[];

  if (!isRequestDeclined) {
    dynamicSteps = ALL_STEPS.filter(step => step !== VerificationRequestStatus.DECLINED);
  } else {
    dynamicSteps = ALL_STEPS.filter(step => step !== VerificationRequestStatus.POSTED);
  }

  const completedStepIndex = dynamicSteps.indexOf(currentStatus);

  return (
    <Stepper
      activeStep={completedStepIndex}
      orientation="vertical"
    >
      {dynamicSteps.map((stepLabel, index) => {
        const isCompleted = index <= completedStepIndex;
        const isDeclined = stepLabel === VerificationRequestStatus.DECLINED;

        const stepDate = getDateForStep(stepLabel);
        return (
          <Step
            key={`step-${stepLabel}-${index}`}
            completed={isCompleted}
          >
            <TrackingStep
              stepKey={stepLabel}
              stepDate={stepDate}
              isCompleted={isCompleted}
              isDeclined={isDeclined}
            />
          </Step>
        );
      })}
    </Stepper>
  );
};

export default TrackingStepper;