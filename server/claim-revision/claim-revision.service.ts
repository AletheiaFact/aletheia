import {Injectable, Logger} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import slugify from 'slugify'
import { ParserService } from "../parser/parser.service";
import { SourceService } from "../source/source.service";
import { SourceTargetModel } from "../source/schemas/source.schema";
import { ClaimRevision, ClaimRevisionDocument } from "./schema/claim-revision.schema";

@Injectable()
export class ClaimRevisionService {
    private optionsToUpdate: { new: boolean; upsert: boolean };
    private readonly logger = new Logger("ClaimService");

    constructor(
        @InjectModel(ClaimRevision.name)
        private ClaimRevisionModel: Model<ClaimRevisionDocument>,
        private sourceService: SourceService,
        private parserService: ParserService
    ) {
        this.optionsToUpdate = {
            new: true,
            upsert: true,
        };
    }

    /** get ClaimRevision by ID */
    getRevision(claimId) {
        return this.ClaimRevisionModel.findOne({ claimId })
    }
    /**
     *
     * @param claimId an unique claim id
     * @param claim Claim Content
     * @returns Save the claimRevision in database
     */
    async create(claimId, claim) {
        claim.claimId = claimId;
        if (typeof claim.content === "string") {
            claim.content = this.parserService.parse(claim.content);
        }
        claim.slug = slugify(claim.title, {
            lower: true,     // convert to lower case, defaults to `false`
            strict: true     // strip special characters except replacement, defaults to `false`
        })
        const newClaimRevision = new this.ClaimRevisionModel(claim);
        if (claim.sources && Array.isArray(claim.sources)) {
            try {
                for (let source of claim.sources) {
                    await this.sourceService.create({
                        link: source,
                        targetId: claimId,
                        targetModel: SourceTargetModel.Claim,
                    });
                }
            } catch (e) {
                this.logger.error(e);
                throw e;
            }
        }
        return newClaimRevision.save();
    }
}
