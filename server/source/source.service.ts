import { Injectable, NotFoundException } from "@nestjs/common";
import { Model, Types } from "mongoose";
import { SourceDocument, Source } from "./schemas/source.schema";
import { InjectModel } from "@nestjs/mongoose";
const md5 = require("md5");

@Injectable()
export class SourceService {
    constructor(
        @InjectModel(Source.name)
        private SourceModel: Model<SourceDocument>
    ) {}

    async listAll({ page, pageSize, order, nameSpace }): Promise<Source[]> {
        return this.SourceModel.find({
            nameSpace,
            "props.classification": { $exists: true },
        })
            .skip(page * parseInt(pageSize, 10))
            .limit(parseInt(pageSize, 10))
            .sort({ _id: order })
            .lean();
    }

    async listAllDailySourceReviews(query) {
        return this.SourceModel.find({
            ...query,
            "props.classification": { $exists: true },
        });
    }

    async create(data) {
        if (data?.targetId) {
            data.targetId = [Types.ObjectId(data.targetId)];
        }
        if (data?.props?.date) {
            data.props.date = new Date(data.props.date);
        }
        data.data_hash = md5(data.href);
        data.user = Types.ObjectId(data.user);
        //TODO: don't create duplicate sources in one claim review task
        return await new this.SourceModel(data).save();
    }

    async updateTargetId(sourceId, newTargetId) {
        // false positive in sonar cloud
        const source = await this.SourceModel.findById(sourceId);
        source.targetId = [...source.targetId, newTargetId];
        source.save();
        return source;
    }

    async getByTargetId(targetId, page, pageSize, order = "asc") {
        targetId = Types.ObjectId(targetId);

        return this.SourceModel.find({ targetId })
            .skip(page * pageSize)
            .limit(pageSize)
            .sort({ _id: order });
    }

    find(match) {
        return this.SourceModel.find({ match }, { _id: 1, href: 1 });
    }

    getSourceByHref(href: string) {
        return this.SourceModel.findOne({ href: { $eq: href } }).exec();
    }

    getById(_id) {
        return this.SourceModel.findById(_id);
    }

    async getByDataHash(data_hash) {
        const source = await this.SourceModel.findOne({ data_hash });

        if (source) {
            return source;
        } else {
            throw new NotFoundException();
        }
    }

    async update(data_hash, sourceBodyUpdate) {
        const source = await this.getByDataHash(data_hash);

        const newSource = Object.assign(source, sourceBodyUpdate);
        const sourceUpdated = await this.SourceModel.findByIdAndUpdate(
            source._id,
            newSource,
            {
                new: true,
                upsert: true,
            }
        );

        return sourceUpdated;
    }

    count(query) {
        return this.SourceModel.countDocuments().where({
            ...query,
            "props.classification": { $exists: true },
        });
    }
}
