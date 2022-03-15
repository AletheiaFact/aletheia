import { IsString } from 'class-validator';
import { PartialType, OmitType } from "@nestjs/mapped-types"
import { CreateClaim } from "./create-claim.dto";

export class UpdateClaimDTO extends PartialType(OmitType(CreateClaim, ['recaptcha', 'sources'] as const)){
  @IsString()
  id: string;
}