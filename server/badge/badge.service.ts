import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Badge, BadgeDocument } from "./schemas/badge.schema";

@Injectable()
export class BadgeService {
    constructor(
        @InjectModel(Badge.name)
        private BadgeModel: Model<BadgeDocument>
    ) {}

    async create(badge) {
        const newBadge = new this.BadgeModel(badge);
        return await newBadge.save();
    }

    async update(badge) {
        const updatedBadge = await this.BadgeModel.findByIdAndUpdate(
            badge._id,
            badge,
            { new: true }
        );
        return updatedBadge;
    }

    async listAll() {
        return await this.BadgeModel.find();
    }

    async getById(badgeId) {
        const badge = await this.BadgeModel.findById(badgeId);
        return badge;
    }
}
