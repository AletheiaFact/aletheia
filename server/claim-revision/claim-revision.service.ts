import {Injectable, Logger} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import slugify from 'slugify'
import { ParserService } from "../parser/parser.service";
import { SourceService } from "../source/source.service";
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
    
    async getHello() {
        return 'Hello World'
    }

    async create(claimRevision) {
        claimRevision.content = this.parserService.parse(claimRevision.content);
        claimRevision.slug = slugify(claimRevision.title, {
            lower: true,     // convert to lower case, defaults to `false`
            strict: true     // strip special characters except replacement, defaults to `false`
        })
        claimRevision.personality = new Types.ObjectId(claimRevision.personality);
        const newClaimRevision = new this.ClaimRevisionModel(claimRevision);
        if (claimRevision.sources && Array.isArray(claimRevision.sources)) {
            try {
                for (let i = 0; i < claimRevision.sources.length ; i++) {
                    await this.sourceService.create({
                        link: claimRevision.sources[i],
                        targetId: newClaimRevision.id,
                        targetModel: "Claim",
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