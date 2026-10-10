import type { IParagraphService } from "../../../interfaces/paragraph.service.interface";
import type { MongoParagraphService } from "./mongo/paragraph.service";
import type { PostgresParagraphService } from "./postgres/paragraph.service";
import type { ExactlyImplements } from "../../../interfaces/service-surface.type";

export const _mongoExact: ExactlyImplements<
    MongoParagraphService,
    IParagraphService
> = true;
export const _pgExact: ExactlyImplements<
    PostgresParagraphService,
    IParagraphService
> = true;
