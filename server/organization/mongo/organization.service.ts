import {
    ConflictException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ISoftDeletedModel } from "mongoose-softdelete-typescript";
import type {
    IOrganizationService,
    OrganizationCreateInput,
    OrganizationUpdateInput,
} from "../../interfaces/organization.service.interface";
import type { IOrganization } from "../../interfaces/organization.interface";
import { escapeRegex } from "../../util/regex.util";
import {
    firstFreeSlug,
    slugVariantsFilter,
    toSlug,
} from "../../util/slug.util";
import { toError } from "../../util/error-handling";
import {
    Organization,
    OrganizationDocument,
} from "./schemas/organization.schema";

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
                slug: await this.generateUniqueSlug(input.name),
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
        const organization = await this.organizationModel
            .findOneAndUpdate(
                { _id: id, isDeleted: false },
                { $set: input },
                { new: true, runValidators: true }
            )
            .populate("logo")
            .exec();

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

    // Fixed at creation, like event slugs: it will be the public URL of the
    // organization page. Deleted organizations keep theirs reserved.
    private async generateUniqueSlug(name: string): Promise<string> {
        const base = toSlug(name);
        const existing = await this.organizationModel
            .find(slugVariantsFilter(base))
            .select("slug")
            .lean<Pick<Organization, "slug">[]>()
            .exec();
        return firstFreeSlug(base, new Set(existing.map(({ slug }) => slug)));
    }

    private mapWriteError(error: unknown): unknown {
        const err = toError(error);
        if (err.code === 11000) {
            return new ConflictException(
                "Organization slug taken by a concurrent save, retry"
            );
        }
        return error;
    }
}
