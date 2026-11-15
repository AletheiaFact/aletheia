import {
    BadRequestException,
    Inject,
    Injectable,
    InternalServerErrorException,
    Logger,
    NotFoundException,
} from "@nestjs/common";
import { asc, eq, sql } from "drizzle-orm";
import type {
    IImageService,
    ImageUpload,
} from "../../../../interfaces/image.service.interface";
import type { IImage } from "../../../../interfaces/claim-content.interface";
import type { IReportService } from "../../../../interfaces/report.service.interface";
import { DRIZZLE } from "../../../../database/postgres/postgres.provider";
import type { DrizzleClient } from "../../../../database/postgres/connection";
import { isInvalidUuidError } from "../../../../database/postgres/invalid-uuid";
import { toError } from "../../../../util/error-handling";
import { GetByDataHashDto } from "../../../dto/get-by-datahash.dto";
import { image } from "./schema/image.schema";
import { toImageEntity } from "../../../postgres/content.entity";

// History writes on create are deferred until history ports (Phase 6), as
// for claim; the service is therefore not request-scoped.
@Injectable()
export class PostgresImageService implements IImageService {
    private readonly logger = new Logger(PostgresImageService.name);

    constructor(
        @Inject(DRIZZLE) private readonly db: DrizzleClient,
        @Inject("ReportService") private readonly reportService: IReportService
    ) {}

    async create(
        upload: ImageUpload,
        claimRevisionId: any = null
    ): Promise<IImage> {
        if (!upload?.DataHash || !upload?.FileURL) {
            throw new BadRequestException(
                "An image needs a DataHash and a FileURL."
            );
        }
        const [row] = await this.db
            .insert(image)
            .values({
                dataHash: upload.DataHash,
                props: { key: upload.Key, extension: upload.Extension },
                content: upload.FileURL,
                claimRevisionId: claimRevisionId
                    ? String(claimRevisionId)
                    : null,
            })
            .returning();
        return toImageEntity(row);
    }

    async getById(id: string): Promise<IImage | null> {
        try {
            const [row] = await this.db
                .select()
                .from(image)
                .where(eq(image.id, String(id)))
                .limit(1);
            return row ? toImageEntity(row) : null;
        } catch (error) {
            if (isInvalidUuidError(error)) return null;
            throw error;
        }
    }

    async getByDataHash(data_hash: string): Promise<IImage> {
        const validated = GetByDataHashDto.safeParse({ data_hash });
        if (!validated.success) {
            throw new BadRequestException("Invalid data_hash format");
        }
        const hash = validated.data.data_hash;

        const report = await this.reportService.findByDataHash(hash);
        const [row] = await this.db
            .select()
            .from(image)
            .where(eq(image.dataHash, hash))
            .orderBy(asc(image.createdAt), asc(image.id))
            .limit(1);
        if (!row) {
            throw new NotFoundException();
        }
        const entity = toImageEntity(row);
        entity.props = {
            classification: report?.classification,
            classificationMethodology:
                report?.classificationMethodology ?? undefined,
            ...entity.props,
        };
        return entity;
    }

    async updateImageWithTopics(
        topics: any[],
        data_hash: string
    ): Promise<IImage | null> {
        if (!Array.isArray(topics)) {
            throw new BadRequestException("Invalid topics array.");
        }
        const found = await this.getByDataHash(data_hash);
        const [row] = await this.db
            .update(image)
            .set({ topics, updatedAt: new Date() })
            .where(eq(image.id, String(found._id)))
            .returning();
        return row ? toImageEntity(row) : null;
    }

    async getHashesByTopic(topicId: string): Promise<string[]> {
        this.logger.debug(`Fetching image hashes for topic: ${topicId}`);
        try {
            const rows = await this.db
                .select({ dataHash: image.dataHash })
                .from(image)
                .where(
                    sql`${image.topics} @> ${JSON.stringify([
                        { id: topicId },
                    ])}::jsonb`
                );
            return rows.map((r) => r.dataHash);
        } catch (error) {
            const err = toError(error);
            this.logger.error(
                `Failed to fetch image hashes for topic: ${topicId}`,
                err.stack
            );
            throw new InternalServerErrorException(
                `An error occurred while retrieving images for the requested topic.`
            );
        }
    }
}
