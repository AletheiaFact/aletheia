import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Badge, BadgeDocument } from "./schemas/badge.schema";

@Injectable()
export class BadgeService {
    constructor(
        @InjectModel(Badge.name)
        private BadgeModel: Model<BadgeDocument>
    ) {}

    async create(badge) {
        const newBadge = new this.BadgeModel({
            ...badge,
            image: Types.ObjectId(badge.image._id),
        });
        return await newBadge.save();
    }

    async update(badge) {
        const { image, ...updatedFields } = badge;
        const controlledBadge = {
            ...updatedFields,
            image: Types.ObjectId(badge.image._id),
        };
        const updatedBadge = this.BadgeModel.findByIdAndUpdate(
            badge._id,
            controlledBadge,
            { new: true }
        );
        return updatedBadge;
    }

    async listAll() {
        const badge = this.BadgeModel.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "badges",
                    as: "users",
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                            },
                        },
                    ],
                },
            },
            {
                $lookup: {
                    from: "images",
                    localField: "image",
                    foreignField: "_id",
                    as: "image",
                },
            },
            {
                $addFields: {
                    image: {
                        $arrayElemAt: ["$image", 0],
                    },
                },
            },
        ]);
        return badge;
    }

    async getById(badgeId) {
        const badge = this.BadgeModel.findById(badgeId);
        return badge;
    }
}
