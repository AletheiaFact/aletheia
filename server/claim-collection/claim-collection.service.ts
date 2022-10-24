import { Inject, Injectable, Scope } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { CreateClaimCollectionDto } from "./dto/create-claim-collection.dto";
import { UpdateClaimCollectionDto } from "./dto/update-claim-collection.dto";
import { REQUEST } from "@nestjs/core";
import { BaseRequest } from "../types";
import {
    ClaimCollection,
    ClaimCollectionDocument,
} from "./schemas/claim-collection.schema";
import slugify from "slugify";

@Injectable({ scope: Scope.REQUEST })
export class ClaimCollectionService {
    constructor(
        @Inject(REQUEST) private req: BaseRequest,
        @InjectModel(ClaimCollection.name)
        private ClaimCollectionModel: Model<ClaimCollectionDocument>
    ) {}

    async listAll(page, pageSize, order, query) {
        return this.ClaimCollectionModel.find({
            ...query,
        })
            .skip(page * pageSize)
            .limit(pageSize)
            .sort({ _id: order });
    }

    getById(claimCollectionId: string) {
        return this.ClaimCollectionModel.findById(claimCollectionId).populate(
            "personalities"
        );
    }

    async create(claimCollectionBody: CreateClaimCollectionDto) {
        const slug = slugify(claimCollectionBody.title, {
            lower: true, // convert to lower case, defaults to `false`
            strict: true, // strip special characters except replacement, defaults to `false`
        });
        const newClaimCollection = new this.ClaimCollectionModel({
            ...claimCollectionBody,
            slug,
        });
        return newClaimCollection.save();
    }

    async update(
        claimCollectionId: string,
        newClaimCollection: UpdateClaimCollectionDto
    ) {
        return this.ClaimCollectionModel.updateOne(
            { _id: claimCollectionId },
            newClaimCollection
        );
    }

    count(query: any = {}) {
        return this.ClaimCollectionModel.countDocuments().where(query);
    }
}
