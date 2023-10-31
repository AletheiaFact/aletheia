import { PartialType } from "@nestjs/mapped-types";
import { CreateNameSpaceDTO } from "./create-namespace.dto";
import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateNameSpaceDTO extends PartialType(CreateNameSpaceDTO) {
    @IsString()
    @ApiProperty()
    _id: string;
}
