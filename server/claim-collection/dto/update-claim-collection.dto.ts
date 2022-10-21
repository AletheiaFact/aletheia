import { PartialType } from "@nestjs/mapped-types";
import { CreateClaimCollectionDto } from "./create-claim-collection.dto";
import { IsBoolean, IsOptional } from "class-validator";

export class UpdateClaimCollectionDto extends PartialType(
    CreateClaimCollectionDto
) {
    @IsBoolean()
    @IsOptional()
    isHidden?: boolean;
}
