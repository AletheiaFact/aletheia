import { PartialType} from "@nestjs/mapped-types"
import { CreatePersonality } from "./create-personality.dto"

export class UpdatePersonality extends PartialType (CreatePersonality) {}