import type {
    IPersonalityCreateInput,
    IPersonalityUpdateInput,
    IPersonalityListQuery,
} from "../../interfaces/personality.interface";
import type { CreatePersonalityDTO } from "./create-personality.dto";
import type { GetPersonalities } from "./get-personalities.dto";

export const toCreatePersonalityInput = (
    dto: CreatePersonalityDTO
): IPersonalityCreateInput => ({
    name: dto.name,
    description: dto.description,
    wikidata: dto.wikidata,
});

export const toUpdatePersonalityInput = (
    dto: Partial<CreatePersonalityDTO>
): IPersonalityUpdateInput => ({
    name: dto.name,
    description: dto.description,
    wikidata: dto.wikidata,
});

export const toListPersonalitiesQuery = (
    dto: GetPersonalities
): IPersonalityListQuery => ({
    page: dto.page,
    pageSize: dto.pageSize,
    order: dto.order,
    name: dto.name,
    isHidden: typeof dto.isHidden === "boolean" ? dto.isHidden : undefined,
    language: dto.language,
    withSuggestions: dto.withSuggestions,
    nameSpace: dto.nameSpace,
});
