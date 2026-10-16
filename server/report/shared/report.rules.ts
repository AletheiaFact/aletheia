import { ClassificationEnum } from "../../claim-review/dto/create-claim-review.dto";

export function isValidClassification(classification: unknown): boolean {
    return Object.values(ClassificationEnum).includes(
        classification as ClassificationEnum
    );
}
