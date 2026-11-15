import type { IImageService } from "../../../interfaces/image.service.interface";
import type { MongoImageService } from "./mongo/image.service";
import type { PostgresImageService } from "./postgres/image.service";
import type { ExactlyImplements } from "../../../interfaces/service-surface.type";

export const _mongoExact: ExactlyImplements<MongoImageService, IImageService> =
    true;
export const _pgExact: ExactlyImplements<PostgresImageService, IImageService> =
    true;
