import { ILogger } from "../../lib/loggerInterface";

const User = require("../model/userModel");

/**
 * @class SourceRepository
 */
export default class UserRepository {
    optionsToUpdate: Object;
    logger: ILogger;
    models: Object;

    constructor(logger: any = {}) {
        this.logger = logger;
    }

    register(user) {
        return User.register(
            new User({
                email: user.email
            }),
            user.password
        );
    }

    async getById(userId) {
        const user = await User.findById(userId, { name: 1 });
        this.logger.log("info", `Found user ${user._id}`);
        return user;
    }

    async changePassword(userId, currentPassword, newPassword) {
        const user = await this.getById(userId);
        return user.changePassword(currentPassword, newPassword).then(() => {
            if (user.firstPasswordChanged === false) {
                this.logger.log(
                    "info",
                    `User ${user._id} changed first password`
                );
                user.firstPasswordChanged = true;
            }
            this.logger.log("info", `User ${user._id} changed password`);
            user.save();
        });
    }
}
