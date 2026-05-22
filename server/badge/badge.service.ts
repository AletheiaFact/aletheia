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

    async create(badge: any) {
        const newBadge = new this.BadgeModel({
            ...badge,
            image: new Types.ObjectId(badge.image._id),
        });
        return await newBadge.save();
    }

    async update(badge: any) {
        const { image, _id, ...updatedFields } = badge;
        const controlledBadge = {
            ...updatedFields,
            image: new Types.ObjectId(image._id),
        };
        return this.BadgeModel.findByIdAndUpdate(
            new Types.ObjectId(_id),
            { $set: controlledBadge },
            { new: true }
        );
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

    async getById(badgeId: string) {
        const badge = this.BadgeModel.findById(badgeId);
        return badge;
    }
}
