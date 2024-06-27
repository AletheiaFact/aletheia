import { PartialType } from "@nestjs/mapped-types";
import { CreateReviewTaskDTO } from "./create-review-task.dto";

export class UpdateReviewTaskDTO extends PartialType(CreateReviewTaskDTO) {}
