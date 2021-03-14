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
}
