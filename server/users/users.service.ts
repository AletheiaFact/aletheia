import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import OryService from "../ory/ory.service";
import { User, UserDocument } from "./schemas/user.schema";

@Injectable()
export class UsersService {
    private readonly logger = new Logger("UserService");
    constructor(
        @InjectModel(User.name) private UserModel: Model<UserDocument>,
        private oryService: OryService
    ) {}

    async findAll(getUsers): Promise<User[]> {
        const { searchName } = getUsers;
        return this.UserModel.aggregate([
            { $match: { name: { $regex: searchName, $options: "i" } } },
            { $project: { _id: 1, name: 1 } },
        ]);
    }

    async register(user) {
        const newUser = new this.UserModel(user);

        if (!newUser.oryId) {
            this.logger.log("No user id provided, creating a new ory identity");
            const { data: oryUser } = await this.oryService.createIdentity(
                newUser,
                user.password
            );
            newUser.oryId = oryUser.id;
        } else {
            this.logger.log("User id provided, updating a new ory identity");
            await this.oryService.updateIdentity(newUser, user.password);
        }
        try {
            // @ts-ignore
            return await newUser.save();
        } catch (e) {
            this.logger.error(e);
            this.logger.error(`Error registering user ${user.email}`);
        }
    }

    async getById(userId) {
        const user = await this.UserModel.findById(userId);
        this.logger.log(`Found user ${user._id}`);
        return user;
    }

    async registerPasswordChange(userId) {
        const user = await this.getById(userId);
        if (user.firstPasswordChanged === false) {
            user.firstPasswordChanged = true;
            this.logger.log(`User ${user._id} changed first password`);
            user.save();
        }
    }
}
