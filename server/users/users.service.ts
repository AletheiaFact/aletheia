import { Model } from "mongoose";
import {Injectable, Logger} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { UserDocument } from "./schemas/user.schema";
import { UserDto } from "./dto/create-user.dto"

@Injectable()
export class UsersService {
    private readonly logger = new Logger("UserService");
    constructor(
        @InjectModel(UserDto.name) private UserModel: Model<UserDocument>
    ) {}

    async findAll(): Promise<UserDto[]> {
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
