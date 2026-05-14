import { NestFactory } from "@nestjs/core";
import { AppModule } from "../app.module";
import { NestExpressApplication } from "@nestjs/platform-express";
import { UsersService } from "../users/users.service";
import { NotificationService } from "../notifications/notifications.service";
import { WinstonLogger } from "../winstonLogger";
import loadConfig from "../configLoader";
import { toError } from "../util/error-handling";

async function createNovuSubscriber(
    userFromDB: any,
    novuService: NotificationService,
    logger: WinstonLogger
) {
    if (!userFromDB || !userFromDB.id) {
        throw new Error(`Invalid user data: ${JSON.stringify(userFromDB)}`);
    }

    try {
        await novuService.createSubscriber({
            _id: userFromDB.id,
            email: userFromDB.email,
            name: userFromDB.name,
        });
        logger.log(`Subscriber created for user ${userFromDB.email}`);
    } catch (error) {
        const err = toError(error);
        throw new Error(
            `Failed to create Novu subscriber for user ${userFromDB.email}: ${err.message}`
        );
    }
}

async function initApp() {
    const options = loadConfig();
    const logger = new WinstonLogger();

    const app = await NestFactory.create<NestExpressApplication>(
        AppModule.register(options)
    );

    logger.log(`AppModule loaded`);

    const userService = await app.resolve(UsersService);
    const novuService = await app.resolve(NotificationService);

    try {
        const users = await userService.getAllUsers();

        for (const user of users) {
            await createNovuSubscriber(user, novuService, logger);
        }

        logger.log("All users have been processed for Novu subscription.");
    } catch (error) {
        const err = toError(error);
        logger.error(
            "An error occurred while creating Novu subscribers:",
            err
        );
    } finally {
        await app.close();
    }
}

initApp();
