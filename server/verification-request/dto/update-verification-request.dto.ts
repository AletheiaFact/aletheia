import { PartialType } from "@nestjs/mapped-types";
import { CreateVerificationRequestDTO } from "./create-verification-request-dto";
import { IsArray, IsBoolean, IsEnum, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Group } from "../../group/schemas/group.schema";
import { Transform } from "class-transformer";
import { Source } from "../../source/schemas/source.schema";
import { VerificationRequestStatus } from "./types";

export class UpdateVerificationRequestDTO extends PartialType(
    CreateVerificationRequestDTO
) {
    @IsString()
    @IsOptional()
    @ApiProperty()
    targetId: string;

    @IsArray()
    @IsOptional()
    @ApiProperty()
    group: Group;

    @IsOptional()
    @ApiProperty()
    usersId: string[];

    @IsBoolean()
    @IsOptional()
    @ApiProperty()
    isSensitive: boolean;

    @IsArray()
    @ApiProperty()
    @IsOptional()
    source: Source[];

    @ApiProperty()
    @IsOptional()
    @Transform(({ value }) => {
        return [true, "enabled", "true", 1, "1"].indexOf(value) > -1;
    })
    rejected?: boolean;

    @IsEnum(VerificationRequestStatus)
    @IsOptional()
    @ApiProperty()
    status?: VerificationRequestStatus;
}
