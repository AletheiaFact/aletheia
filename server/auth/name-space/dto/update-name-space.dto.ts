import { PartialType } from "@nestjs/mapped-types";
import { CreateNameSpaceDTO } from "./create-namespace.dto";

export class UpdateNameSpaceDTO extends PartialType(CreateNameSpaceDTO) {}
