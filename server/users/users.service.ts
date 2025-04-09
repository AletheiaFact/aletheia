import { Inject, Injectable, Logger, Scope } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Status } from "../auth/ability/ability.factory";
import { Model, Aggregate, Types } from "mongoose";

import OryService from "../auth/ory/ory.service";
import { User, UserDocument } from "./schemas/user.schema";
import { Badge } from "../badge/schemas/badge.schema";
import { NotificationService } from "../notifications/notifications.service";
import { NameSpaceEnum } from "../auth/name-space/schemas/name-space.schema";
import type { BaseRequest } from "../types";
import { REQUEST } from "@nestjs/core";
import { GetUsersDTO } from "./dto/get-users.dto";

@Injectable({ scope: Scope.REQUEST })
export class UsersService {
    private readonly logger = new Logger("UserService");
    constructor(
        @Inject(REQUEST) private req: BaseRequest,
        @InjectModel(User.name) private UserModel: Model<UserDocument>,
        private oryService: OryService,
        private notificationService: NotificationService
    ) {}

    async findAll(userQuery: GetUsersDTO): Promise<UserDocument[]> {
        const {
            searchName,
            filterOutRoles,
            badges,
            project,
            nameSpaceSlug = NameSpaceEnum.Main,
            canAssignUsers = true,
        } = userQuery;
        const { _id: userId } = this.req.user;
        const pipeline: Aggregate<any[]> = this.UserModel.aggregate();

        const matchCondition = canAssignUsers
            ? {
                  name: { $regex: searchName || "", $options: "i" },
                  [`role.${nameSpaceSlug}`]: {
                      $nin: [...(filterOutRoles || []), null],
                  },
                  ...(badges ? { badges } : {}),
              }
            : {
                  _id: Types.ObjectId(userId),
              };

        pipeline.match(matchCondition);

        pipeline.lookup({
            from: "badges",
            localField: "badges",
            foreignField: "_id",
            as: "badges",
        });

        if (nameSpaceSlug && nameSpaceSlug !== NameSpaceEnum.Main) {
            pipeline
                .lookup({
                    from: "namespaces",
                    localField: "_id",
                    foreignField: "users",
                    as: "namespaces",
                })
                .match({
                    "namespaces.slug": nameSpaceSlug,
                });
        }

        pipeline.project(project || { _id: 1, name: 1, role: 1, badges: 1 });

        return await pipeline.exec();
    }
    /**
     * Retrieves all users from the database.
     */
    async getAllUsers(): Promise<UserDocument[]> {
        try {
            this.logger.log("Fetching all users from the database.");
            const users = await this.UserModel.find().exec();
            this.logger.log(`Fetched ${users.length} users.`);
            return users;
        } catch (error) {
            this.logger.error("Error fetching users:", error);
            throw error;
        }
    }

    async register(user) {
        const newUser = new this.UserModel(user);
        this.notificationService.createSubscriber(newUser);
        if (!newUser.oryId) {
            this.logger.log("No user id provided, creating a new ory identity");
            const oryUser = await this.oryService.createIdentity(
                newUser,
                user.password,
                user.role
            );
            newUser.oryId = oryUser.id;
        } else {
            const existingUser = await this.getByOryId(newUser.oryId);
            this.logger.log("User id provided, updating an ory identity");
            await this.oryService.updateIdentity(
                existingUser || newUser,
                user.password,
                user.role
            );
        }
        return await newUser.save();
    }

    async getById(userId) {
        const user = await this.UserModel.findById(userId).populate("badges");
        this.logger.log(`Found user ${user._id}`);
        return user;
    }

    async getByEmail(email: string) {
        const user = await this.UserModel.findOne({ email });
        return user;
    }

    getByOryId(oryId) {
        return this.UserModel.findOne({ oryId }, "email name oryId role");
    }

    async registerPasswordChange(userId) {
        const user = await this.getById(userId);
        if (user.firstPasswordChanged === false) {
            user.firstPasswordChanged = true;
            this.logger.log(`User ${user._id} changed first password`);
            user.save();
        }
    }

    async updateUser(
        userId,
        updates: { role?: object; badges?: Badge[]; state?: Status }
    ) {
        const user = await this.getById(userId);

        if (updates.state) {
            await this.oryService.updateUserState(user, updates.state);
        }
        if (updates.role) {
            await this.oryService.updateUserRole(user, updates.role);
        }

        const updatedUser = this.UserModel.findByIdAndUpdate(userId, updates, {
            new: true,
        });

        this.logger.log(`Updated user ${userId._id}`);
        return updatedUser;
    }
}
