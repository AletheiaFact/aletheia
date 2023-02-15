import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import slugify from "slugify";
import { ParserService } from "../parser/parser.service";
import { SourceService } from "../source/source.service";
import { SourceTargetModel } from "../source/schemas/source.schema";
import {
    ClaimRevision,
    ClaimRevisionDocument,
    ContentModelEnum,
} from "./schema/claim-revision.schema";
import { ImageService } from "../image/image.service";
import { DebateService } from "../debate/debate.service";

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
        private debateService: DebateService
    ) {
        this.optionsToUpdate = {
            new: true,
            upsert: true,
        };
    }

    /** get ClaimRevision by ID */
    getRevision(match) {
        try {
            return this.ClaimRevisionModel.findOne(match)
                .populate("personalities")
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

        if (claim.contentModel === ContentModelEnum.Speech) {
            const newSpeech = await this.parserService.parse(claim.content);
            claim.contentId = newSpeech._id;
        } else if (claim.contentModel === ContentModelEnum.Image) {
            const newImage = await this.imageService.create(claim.content);
            claim.contentId = newImage._id;
        } else if (claim.contentModel === ContentModelEnum.Debate) {
            const newDebate = await this.debateService.create(claim);
            claim.contentId = newDebate._id;
        }

        const newClaimRevision = new this.ClaimRevisionModel(claim);

        if (claim.sources && Array.isArray(claim.sources)) {
            // TODO: check if source already exists
            try {
                for (let source of claim.sources) {
                    if (typeof source === "string") {
                        await this.sourceService.create({
                            link: source,
                            targetId: claimId,
                            targetModel: SourceTargetModel.Claim,
                        });
                    } else {
                        await this.sourceService.update(source._id, claimId);
                    }
                }
            } catch (e) {
                this.logger.error(e);
                throw e;
            }
        }
        return newClaimRevision.save();
    }

    findAll(searchText, pageSize) {
        return this.ClaimRevisionModel.aggregate([
            {
                $search: {
                    index: "claimrevisions_fields",
                    autocomplete: {
                        query: searchText,
                        path: "title",
                    },
                },
            },
            {
                $limit: parseInt(pageSize, 10),
            },
            {
                $lookup: {
                    from: "personalities",
                    localField: "personalities",
                    foreignField: "_id",
                    as: "personality",
                },
            },
            {
                $project: {
                    title: 1,
                    personalities: 1,
                    slug: 1,
                    date: 1,
                },
            },
        ]);
    }

    getByContentId(contentId) {
        return this.ClaimRevisionModel.findOne({ contentId });
    }
}
