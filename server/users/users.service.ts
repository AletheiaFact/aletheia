import { Model } from "mongoose";
import {Injectable, Logger} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "./schemas/user.schema";

@Injectable()
export class UsersService {
    private readonly logger = new Logger("UserService");
    constructor(
        @InjectModel(User.name) private UserModel: Model<UserDocument>
    ) {}

    async findAll(): Promise<User[]> {
        return this.UserModel.find().exec();
    }

    register(user) {
        // @ts-ignore
        return this.UserModel.register(
            new this.UserModel(user),
            user.password
        );
    }

    async getById(userId) {
        const user = await this.UserModel.findById(userId);
        this.logger.log(`Found user ${user._id}`);
        return user;
    }

    async changePassword(userId, currentPassword, newPassword) {
        const user = await this.getById(userId);
        // @ts-ignore
        return user.changePassword(currentPassword, newPassword).then(() => {
            if (user.firstPasswordChanged === false) {
                this.logger.log(`User ${user._id} changed first password`);
                user.firstPasswordChanged = true;
            }
            this.logger.log(`User ${user._id} changed password`);
            user.save();
        });
    }
}
