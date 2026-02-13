import * as React from "react";
import { Step, Stepper } from "@mui/material";
import { VerificationRequestStatus } from "../../types/enums";
import { TrackingResponseDTO } from "../../types/Tracking";
import TrackingStep from "./TrackingStep";

const getVisibleSteps = (currentStatus: VerificationRequestStatus): VerificationRequestStatus[] => {
  const allSteps = Object.values(VerificationRequestStatus);

  if (currentStatus === VerificationRequestStatus.DECLINED) {
    return allSteps.filter(step => step !== VerificationRequestStatus.POSTED);
  }

  return allSteps.filter(step => step !== VerificationRequestStatus.DECLINED);
};

const TrackingStepper = ({
  currentStatus,
  historyEvents,
}: TrackingResponseDTO) => {
  const dynamicSteps = getVisibleSteps(currentStatus);
  const completedStepIndex = dynamicSteps.indexOf(currentStatus);

  const getDateForStep = (stepStatus: VerificationRequestStatus) => {
    const history = historyEvents.find(h => h.status === stepStatus);
    return history ? new Date(history.date) : null;
  };

  return (
    <Stepper activeStep={completedStepIndex} orientation="vertical">
      {dynamicSteps.map((stepLabel, index) => {
        const isCompleted = index <= completedStepIndex;
        const isDeclined = stepLabel === VerificationRequestStatus.DECLINED;
        const stepDate = getDateForStep(stepLabel);

        return (
          <Step key={stepLabel} completed={isCompleted}>
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