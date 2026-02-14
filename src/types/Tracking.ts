import { VerificationRequestStatus } from "./enums";
interface TrackingCardProps {
    verificationRequestId: string;
    isMinimal?: boolean
}

interface TrackingResponseDTO {
    currentStatus: VerificationRequestStatus;
    historyEvents: HistoryItem[];
    isMinimal?: boolean
}

interface HistoryItem {
    id: string;
    status: VerificationRequestStatus;
    date: Date;
}

interface TrackingStepProps {
    stepKey: string;
    stepDate: Date | null;
    isCompleted: boolean;
    isDeclined: boolean;
    isMinimal?: boolean
}

interface StepLabelStyledProps {
    backgroundStatusColor: string;
    iconColor: string;
}

export type { TrackingResponseDTO, TrackingCardProps, TrackingStepProps, StepLabelStyledProps };
