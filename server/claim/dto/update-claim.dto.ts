import { PartialType } from "@nestjs/mapped-types"
import { CreateClaimDTO } from "./create-claim.dto";

export class UpdateClaimDTO extends PartialType(CreateClaimDTO){}
