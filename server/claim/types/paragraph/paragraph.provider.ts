import type { IParagraphService } from "../../../interfaces/paragraph.service.interface";
import { Provider } from "@nestjs/common";
import { MongoParagraphService } from "./mongo/paragraph.service";
import { PostgresParagraphService } from "./postgres/paragraph.service";
import { createDbServiceProvider } from "../../../database/db-service.provider";

export const paragraphServiceProvider: Provider =
    createDbServiceProvider<IParagraphService>(
        "ParagraphService",
        MongoParagraphService,
        PostgresParagraphService
    );
