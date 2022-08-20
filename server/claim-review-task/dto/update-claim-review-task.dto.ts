import { PartialType } from "@nestjs/mapped-types";
import { IsNotEmpty, IsString } from "class-validator";
import { CreateClaimReviewTaskDTO } from "./create-claim-review-task.dto";

export class UpdateClaimReviewTaskDTO extends PartialType(
    CreateClaimReviewTaskDTO
) {
    @IsNotEmpty()
    @IsString()
    recaptcha: string;
}
