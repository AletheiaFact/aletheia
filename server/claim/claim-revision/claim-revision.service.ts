import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import slugify from "slugify";
import { ParserService } from "../parser/parser.service";
import { SourceService } from "../../source/source.service";
import { SourceTargetModel } from "../../source/schemas/source.schema";
import {
    ClaimRevision,
    ClaimRevisionDocument,
} from "./schema/claim-revision.schema";
import { ContentModelEnum } from "../../types/enums";
import { ImageService } from "../types/image/image.service";
import { DebateService } from "../types/debate/debate.service";
import { UtilService } from "../../util";
import { IFindAllOptions } from "../../interfaces/personality.interface";

@Injectable()
export class ClaimRevisionService {
    private optionsToUpdate: { new: boolean; upsert: boolean };
    private readonly logger = new Logger("ClaimService");

    constructor(
        @InjectModel(ClaimRevision.name)
        private ClaimRevisionModel: Model<ClaimRevisionDocument>,
        private sourceService: SourceService,
        private parserService: ParserService,
        private imageService: ImageService,
        private debateService: DebateService,
        private util: UtilService
    ) {
        this.optionsToUpdate = {
            new: true,
            upsert: true,
        };
    }

    getRevision(match) {
        try {
            return this.ClaimRevisionModel.findOne(match)
                .populate("personalities")
                .populate("content")
                .lean();
        } catch {
            throw new NotFoundException();
        }
    }

    /** get ClaimRevision by ID */
    getRevisionById(id) {
        try {
            return this.ClaimRevisionModel.findById(id)
                .populate("personalities")
                .populate("content")
                .lean();
        } catch {
            throw new NotFoundException();
        }
    }
    /**
     *
     * @param claimId an unique claim id
     * @param claim Claim Content
     * @returns Save the claimRevision in database
     */
    async create(claimId, claim) {
        claim.claimId = claimId;
        claim.slug = slugify(claim.title, {
            lower: true, // convert to lower case, defaults to `false`
            strict: true, // strip special characters except replacement, defaults to `false`
        });
        const newClaimRevision = new this.ClaimRevisionModel(claim);
        const newclaimRevisionId = Types.ObjectId(newClaimRevision._id);

        newClaimRevision.contentId = await this._createContentModel(
            claim,
            newclaimRevisionId
        );

        await this._createSources(claim.sources, claimId);
        return newClaimRevision.save();
    }

    async findAll({
        searchText,
        pageSize,
        skippedDocuments,
        nameSpace,
    }: IFindAllOptions) {
        const aggregationPipeline = [
            {
                $search: {
                    index: "claimrevisions_fields",
                    text: {
                        query: searchText,
                        path: "title",
                        fuzzy: {
                            maxEdits: 1, // Using maxEdits: 1 to allow minor typos or spelling errors in search queries.
                        },
                    },
                },
            },
            {
                $lookup: {
                    from: "claims",
                    localField: "claimId",
                    foreignField: "_id",
                    as: "claimContent",
                },
            },
            {
                $lookup: {
                    from: "personalities",
                    localField: "personalities",
                    foreignField: "_id",
                    as: "personality",
                },
            },
            this.util.getVisibilityMatch(nameSpace),
            {
                $project: {
                    title: 1,
                    contentModel: 1,
                    "personality.slug": 1,
                    "personality.name": 1,
                    slug: 1,
                    date: 1,
                },
            },
            {
                $facet: {
                    rows: [
                        {
                            $skip: skippedDocuments || 0,
                        },
                        {
                            $limit: pageSize,
                        },
                    ],
                    totalRows: [
                        {
                            $count: "totalRows",
                        },
                    ],
                },
            },
            {
                $set: {
                    totalRows: {
                        $arrayElemAt: ["$totalRows.totalRows", 0],
                    },
                },
            },
        ];

        const [result] = await this.ClaimRevisionModel.aggregate(
            aggregationPipeline
        );

        const { rows, totalRows } = result;

        return {
            totalRows,
            processedRevisions: rows,
        };
    }

    getByContentId(contentId) {
        return this.ClaimRevisionModel.findOne({ contentId });
    }

    private async _createContentModel(claim, claimRevisionId) {
        switch (claim.contentModel) {
            case ContentModelEnum.Speech:
                return (
                    await this.parserService.parse(
                        claim.content,
                        claimRevisionId
                    )
                )._id;
            case ContentModelEnum.Image:
                return (
                    await this.imageService.create(
                        claim.content,
                        claimRevisionId
                    )
                )._id;
            case ContentModelEnum.Debate:
                return (await this.debateService.create(claim, claimRevisionId))
                    ._id;
            case ContentModelEnum.Unattributed:
                return (
                    await this.parserService.parse(
                        claim.content,
                        claimRevisionId,
                        null,
                        claim.contentModel
                    )
                )._id;
        }
    }

    private async _createSources(sources, claimId) {
        if (sources && Array.isArray(sources)) {
            for (let source of sources) {
                try {
                    const existingSources =
                        await this.sourceService.getSourceByHref(source);
                    if (existingSources) {
                        this.sourceService.updateTargetId(
                            existingSources._id,
                            claimId
                        );
                    } else {
                        await this.sourceService.create({
                            href: source,
                            targetId: claimId,
                            targetModel: SourceTargetModel.Claim,
                        });
                    }
                } catch (e) {
                    this.logger.error(e);
                    throw e;
                }
            }
        }
    }
}
