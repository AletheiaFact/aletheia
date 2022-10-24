import { PartialType } from "@nestjs/mapped-types";
import { CreateClaimCollectionDto } from "./create-claim-collection.dto";
import { IsBoolean, IsNotEmpty, IsObject, IsOptional } from "class-validator";

export class UpdateClaimCollectionDto extends PartialType(
    CreateClaimCollectionDto
) {
    @IsBoolean()
    @IsOptional()
    isHidden?: boolean;

    @IsObject()
    @IsNotEmpty()
    editorContentObject: any; // TODO: define a type for the editor content object
}
