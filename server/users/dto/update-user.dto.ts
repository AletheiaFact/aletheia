import { PartialType, OmitType } from "@nestjs/mapped-types"
import { UserDto } from "./create-user.dto"

export class UpdateUsersDto extends PartialType (
    OmitType(UserDto, ["email"] as const)
) {}