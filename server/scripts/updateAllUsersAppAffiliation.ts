import { NestFactory } from "@nestjs/core";
import { AppModule } from "../app.module";
import { NestExpressApplication } from "@nestjs/platform-express";
import { ConfigService } from "@nestjs/config";
import { UsersService } from "../users/users.service";
import loadConfig from "../configLoader";
import { WinstonLogger } from "../winstonLogger";
import OryService from "../auth/ory/ory.service";

async function updateUserAppAffiliation(userFromDB, app) {
    const oryService = await app.resolve(OryService);
    const configService = app.get(ConfigService);

    const app_affiliation = configService.get("app_affiliation");
    if (userFromDB && app_affiliation) {
        console.log(userFromDB.email, app_affiliation);
        await oryService.updateIdentity(userFromDB, null, {
            app_affiliation,
            role: userFromDB.role,
        });
    } else {
        throw new Error(`Can't update user ${userFromDB.email}`);
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

    try {
        // Fetch all users from the database
        const users = await userService.getAllUsers();

        // Loop through each user and apply the update
        for (const user of users) {
            await updateUserAppAffiliation(user, app);
            logger.log(`${user.email} updated`);
        }

        logger.log("All users have been updated.");
    } catch (error) {
        logger.error("An error occurred while updating users:", error);
    } finally {
        await app.close();
    }
}

initApp();
