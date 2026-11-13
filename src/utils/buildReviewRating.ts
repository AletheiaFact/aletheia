import { ClassificationEnum } from "../types/enums";
import { getClassificationLabel } from "../../lib/classification-methodology";

interface ReviewRatingInput {
    classification: string;
    classificationMethodology?: string;
    isHidden?: boolean;
    language?: string;
    t: (key: string) => string;
}

// schema.org Rating for ClaimReview / MediaReview JSON-LD. The numbers come
// from the stored value, so they are the same under every methodology; only
// alternateName uses the methodology's wording.
export const buildReviewRating = ({
    classification,
    classificationMethodology,
    isHidden,
    language,
    t,
}: ReviewRatingInput) => ({
    "@type": "Rating",
    ratingValue: isHidden
        ? 0
        : ClassificationEnum[classification as keyof typeof ClassificationEnum],
    bestRating: 8,
    worstRating: 1,
    alternateName: isHidden
        ? t("claimReviewForm:notReviewed")
        : getClassificationLabel(
              classificationMethodology,
              classification,
              language
          ) ?? t(`claimReviewForm:${classification}`),
});
