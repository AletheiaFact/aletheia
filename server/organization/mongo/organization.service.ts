import {
    ConflictException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ISoftDeletedModel } from "mongoose-softdelete-typescript";
import slugify from "slugify";
import type {
    IOrganizationService,
    OrganizationCreateInput,
    OrganizationUpdateInput,
} from "../../interfaces/organization.service.interface";
import type { IOrganization } from "../../interfaces/organization.interface";
import { escapeRegex } from "../../util/regex.util";
import { toError } from "../../util/error-handling";
import {
    Organization,
    OrganizationDocument,
} from "./schemas/organization.schema";

export const deriveOrganizationSlug = (name: string) =>
    slugify(name, { lower: true, strict: true, trim: true });

@Injectable()
export class MongoOrganizationService implements IOrganizationService {
    constructor(
        @InjectModel(Organization.name)
        private readonly organizationModel: ISoftDeletedModel<OrganizationDocument>
    ) {}

    async create(input: OrganizationCreateInput): Promise<IOrganization> {
        try {
            const organization = await this.organizationModel.create({
                ...input,
                slug: deriveOrganizationSlug(input.name),
            });
            return await organization.populate("logo");
        } catch (error) {
            throw this.mapWriteError(error);
        }
    }

    async update(
        id: string,
        input: OrganizationUpdateInput
    ): Promise<IOrganization> {
        const update: OrganizationUpdateInput & { slug?: string } = {
            ...input,
        };
        if (input.name) {
            update.slug = deriveOrganizationSlug(input.name);
        }

        let organization: OrganizationDocument | null;
        try {
            organization = await this.organizationModel
                .findOneAndUpdate(
                    { _id: id, isDeleted: false },
                    { $set: update },
                    { new: true, runValidators: true }
                )
                .populate("logo")
                .exec();
        } catch (error) {
            throw this.mapWriteError(error);
        }

        if (!organization) {
            throw new NotFoundException(`Organization not found: ${id}`);
        }
        return organization;
    }

    search(name: string, limit: number): Promise<IOrganization[]> {
        return this.organizationModel
            .find({
                isDeleted: false,
                name: { $regex: escapeRegex(name), $options: "i" },
            })
            .sort({ name: 1 })
            .limit(limit)
            .populate("logo")
            .exec();
    }

    async findExistingIds(ids: string[]): Promise<string[]> {
        if (!ids.length) {
            return [];
        }
        const organizations = await this.organizationModel
            .find({ _id: { $in: ids }, isDeleted: false })
            .select("_id")
            .lean()
            .exec();
        return organizations.map(({ _id }) => String(_id));
    }

    private mapWriteError(error: unknown): unknown {
        const err = toError(error);
        if (err.code === 11000) {
            return new ConflictException(
                "An organization with this name already exists"
            );
        }
        return error;
    }
}
