import { useContext } from "react";
import { useTranslation } from "next-i18next";
import { ReviewTaskMachineContext } from "../machines/reviewTask/ReviewTaskMachineProvider";
import {
    MethodologyId,
    getClassificationLabel,
    resolveMethodologyId,
} from "../../lib/classification-methodology";

// List items pass their own methodology; inside a review task or review
// page the task's methodology applies; anything else is the default.
export const useClassificationMethodology = (
    explicit?: string | null
): MethodologyId => {
    const { classificationMethodology } = useContext(ReviewTaskMachineContext);
    return resolveMethodologyId(explicit ?? classificationMethodology);
};

export const useClassificationLabel = (
    classification?: string | null,
    explicit?: string | null
): string => {
    const { t, i18n } = useTranslation();
    const methodology = useClassificationMethodology(explicit);
    if (!classification) {
        return "";
    }
    return (
        getClassificationLabel(methodology, classification, i18n.language) ??
        t(`claimReviewForm:${classification}`)
    );
};
