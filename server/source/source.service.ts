import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { Model, SortOrder, Types } from "mongoose";
import { SourceDocument, Source } from "./schemas/source.schema";
import { InjectModel } from "@nestjs/mongoose";
import validator from "validator";
const md5 = require("md5");

@Injectable()
export class SourceService {
    constructor(
        @InjectModel(Source.name)
        private SourceModel: Model<SourceDocument>
    ) {}

    async listAll({
        page,
        pageSize,
        order,
        nameSpace,
    }: {
        page: number;
        pageSize: string;
        order: SortOrder;
        nameSpace: string;
    }): Promise<Source[]> {
        return this.SourceModel.find({
            nameSpace,
            "props.classification": { $exists: true },
        })
            .skip(page * parseInt(pageSize, 10))
            .limit(parseInt(pageSize, 10))
            .sort({ _id: order })
            .lean();
    }

    async listAllDailySourceReviews(query: Record<string, any>) {
        return this.SourceModel.find({
            ...query,
            "props.classification": { $exists: true },
        });
    }

    async create(data: any) {
        if (data?.targetId) {
            data.targetId = [new Types.ObjectId(data.targetId)];
        }
        if (data?.props?.date) {
            data.props.date = new Date(data.props.date);
        }
        if (
            !data.href ||
            !validator.isURL(data.href, { require_protocol: true })
        ) {
            throw new BadRequestException("Invalid URL");
        }

        data.data_hash = md5(data.href);
        data.user = new Types.ObjectId(data.user);

        const existingSource = await this.SourceModel.findOne({
            data_hash: { $eq: data.data_hash },
        });

        if (existingSource) {
            return existingSource;
        }

        return await new this.SourceModel(data).save();
    }

    async updateTargetId(sourceId: string, newTargetId: Types.ObjectId) {
        // false positive in sonar cloud
        const source = await this.SourceModel.findById(sourceId);
        if (!source) {
            throw new NotFoundException(`Source not found: ${sourceId}`);
        }
        source.targetId = [...source.targetId, newTargetId];
        source.save();
        return source;
    }

    async getByTargetId(
        targetId: string,
        page: number,
        pageSize: number,
        order: SortOrder
    ) {
        const objectId = new Types.ObjectId(targetId);

        return this.SourceModel.find({ targetId: objectId })
            .skip(page * pageSize)
            .limit(pageSize)
            .sort({ _id: order, field: "asc" as SortOrder });
    }

    find(match: Record<string, any>) {
        return this.SourceModel.find({ match }, { _id: 1, href: 1 });
    }

    getSourceByHref(href: string) {
        return this.SourceModel.findOne({ href: { $eq: href } }).exec();
    }

    getById(_id: string) {
        return this.SourceModel.findById(_id);
    }

    async getByDataHash(data_hash: string) {
        const source = await this.SourceModel.findOne({ data_hash });

        if (source) {
            return source;
        } else {
            throw new NotFoundException();
        }
    }

    async update(data_hash: string, sourceBodyUpdate: Partial<Source>) {
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

    count(query: Record<string, any>) {
        return this.SourceModel.countDocuments().where({
            ...query,
            "props.classification": { $exists: true },
        });
    }
}
