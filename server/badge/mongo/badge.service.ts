import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import type { IBadgeService } from "../../interfaces/badge.service.interface";
import { Badge, BadgeDocument } from "./schemas/badge.schema";

@Injectable()
export class MongoBadgeService implements IBadgeService {
    constructor(
        @InjectModel(Badge.name)
        private readonly BadgeModel: Model<BadgeDocument>
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
        ).exec();
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
        return badge.exec();
    }

    async getById(badgeId: string) {
        const badge = this.BadgeModel.findById(badgeId);
        return badge.exec();
    }
}
