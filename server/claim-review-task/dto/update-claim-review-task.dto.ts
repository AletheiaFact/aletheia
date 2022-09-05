import { PartialType } from "@nestjs/mapped-types";
import { CreateClaimReviewTaskDTO } from "./create-claim-review-task.dto";

export class UpdateClaimReviewTaskDTO extends PartialType(
    CreateClaimReviewTaskDTO
) {}
