import { NestFactory } from "@nestjs/core";
import { AppModule } from "../app.module";
import { NestExpressApplication } from "@nestjs/platform-express";
import { UsersService } from "../users/users.service";
import { NotificationService } from "../notifications/notifications.service";
import { WinstonLogger } from "../winstonLogger";
import loadConfig from "../configLoader";

async function createNovuSubscriber(userFromDB, novuService) {
    if (!userFromDB || !userFromDB.id) {
        throw new Error(`Invalid user data: ${JSON.stringify(userFromDB)}`);
    }

    try {
        await novuService.createSubscriber({
            _id: userFromDB.id,
            email: userFromDB.email,
            name: userFromDB.name,
        });
        console.log(`Subscriber created for user ${userFromDB.email}`);
    } catch (error) {
        throw new Error(
            `Failed to create Novu subscriber for user ${userFromDB.email}: ${error.message}`
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
            await createNovuSubscriber(user, novuService);
            logger.log(`Novu subscriber created for user: ${user.email}`);
        }

        logger.log("All users have been processed for Novu subscription.");
    } catch (error) {
        logger.error(
            "An error occurred while creating Novu subscribers:",
            error
        );
    } finally {
        await app.close();
    }
}

initApp();
