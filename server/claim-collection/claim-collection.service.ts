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

const EditorClaimCardNodeType = "editor-claim-card";

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

    async getById(
        newClaimCollectionId: string,
        filterItems = false,
        reverse = false,
        lastCollectionItem = null
    ) {
        const claimCollection: any = (
            await this.ClaimCollectionModel.findById(newClaimCollectionId)
                .populate("personalities")
                .populate("sources")
        ).toObject();

        if (filterItems) {
            // Filter collections for view
            claimCollection.collections =
                claimCollection?.editorContentObject?.content || [];
            claimCollection.collections = claimCollection.collections.filter(
                (c) => {
                    return (
                        c.type === EditorClaimCardNodeType &&
                        c.attrs.claimId !== null
                    );
                }
            );
            console.log(filterItems, reverse);
            claimCollection.collections = reverse
                ? claimCollection.collections.reverse()
                : claimCollection.collections;
            delete claimCollection.editorContentObject;
        }

        if (lastCollectionItem) {
            // TODO: define a logic to only return data if the user doesn't have it.
        }

        return claimCollection;
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
