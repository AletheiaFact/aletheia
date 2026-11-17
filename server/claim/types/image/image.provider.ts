import type { IImageService } from "../../../interfaces/image.service.interface";
import { Provider } from "@nestjs/common";
import { MongoImageService } from "./mongo/image.service";
import { PostgresImageService } from "./postgres/image.service";
import { createDbServiceProvider } from "../../../database/db-service.provider";

export const imageServiceProvider: Provider =
    createDbServiceProvider<IImageService>(
        "ImageService",
        MongoImageService,
        PostgresImageService
    );
