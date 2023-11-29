import { Injectable } from "@nestjs/common";
import { Model, Types } from "mongoose";
import { NameSpaceDocument, NameSpace } from "./schemas/name-space.schema";
import { InjectModel } from "@nestjs/mongoose";
import slugify from "slugify";
import { UsersService } from "../../users/users.service";
import { Roles } from "../../auth/ability/ability.factory";
import { UpdateNameSpaceDTO } from "./dto/update-name-space.dto";

@Injectable()
export class NameSpaceService {
    constructor(
        @InjectModel(NameSpace.name)
        private NameSpaceModel: Model<NameSpaceDocument>,
        private usersService: UsersService
    ) {}

    listAll() {
        return this.NameSpaceModel.find().populate("users");
    }

    async create(nameSpace) {
        nameSpace.slug = slugify(nameSpace.name, {
            lower: true,
            strict: true,
        });

        nameSpace.users = await this.updateNameSpaceUsers(
            nameSpace.users,
            nameSpace.slug
        );

        return new this.NameSpaceModel(nameSpace).save();
    }

    async update(id, nameSpaceBody: UpdateNameSpaceDTO) {
        const nameSpace = await this.getById(id);
        const newNameSpace = {
            ...nameSpace.toObject(),
            ...nameSpaceBody,
        };

        newNameSpace.slug = slugify(newNameSpace.name, {
            lower: true,
            strict: true,
        });

        newNameSpace.users = await this.updateNameSpaceUsers(
            newNameSpace.users,
            nameSpace.slug
        );
        await this.findNameSpaceUsersAndDelete(
            nameSpace.slug,
            newNameSpace.users,
            nameSpace.users
        );

        return await this.NameSpaceModel.updateOne(
            { _id: nameSpace._id },
            newNameSpace
        );
    }

    async updateNameSpaceUsers(users, key) {
        const promises = users.map(async (user) => {
            const userId = Types.ObjectId(user._id);
            const existingUser = await this.usersService.getById(userId);

            if (!user.role[key]) {
                await this.usersService.updateUser(existingUser._id, {
                    role: {
                        ...existingUser.role,
                        [key]: Roles.Regular,
                    },
                });
            }

            return userId;
        });

        return await Promise.all(promises);
    }

    async deleteUsersNameSpace(usersId, key) {
        const updatePromises = usersId.map(async (userId) => {
            const id = Types.ObjectId(userId);
            const user = await this.usersService.getById(id);
            delete user.role[key];
            return this.usersService.updateUser(user._id, { role: user.role });
        });

        await Promise.all(updatePromises);
    }

    async findNameSpaceUsersAndDelete(nameSpaceSlug, users, previousUsersId) {
        const usersIdSet = new Set(users.map((user) => user.toString()));
        const nameSpaceUsersTodelete = previousUsersId.filter(
            (previousUserId) => !usersIdSet.has(previousUserId.toString())
        );
        if (nameSpaceUsersTodelete.length > 0) {
            return await this.deleteUsersNameSpace(
                nameSpaceUsersTodelete,
                nameSpaceSlug
            );
        }
    }

    findOne(match) {
        return this.NameSpaceModel.findOne(match);
    }

    getById(_id) {
        return this.NameSpaceModel.findById(_id);
    }
}
