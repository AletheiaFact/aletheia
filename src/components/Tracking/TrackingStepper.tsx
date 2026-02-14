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
  isMinimal,
}: TrackingResponseDTO) => {
  const dynamicSteps = getVisibleSteps(currentStatus);
  const completedStepIndex = dynamicSteps.indexOf(currentStatus);

  const getDateForStep = (stepStatus: VerificationRequestStatus) => {
    const history = historyEvents.find(history => history.status === stepStatus);

    /// This is only necessary because we are not creating histories for this step, so it's good UX to provide feedback. This will no longer be necessary once all steps have a history. Tracked in issue #2244
    if (stepStatus === VerificationRequestStatus.IN_TRIAGE) {
            return "noData"
    }

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
              isMinimal={isMinimal}
            />
          </Step>
        );
      })}
    </Stepper>
  );
};

export default TrackingStepper;
