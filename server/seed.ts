import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { NestExpressApplication } from "@nestjs/platform-express";
import { ConfigService } from "@nestjs/config";
import { UsersService } from "./users/users.service";
import loadConfig from "./configLoader";
import { WinstonLogger } from "./winstonLogger";

async function initApp() {
    const options = loadConfig();

    const logger = new WinstonLogger();
    const app = await NestFactory.create<NestExpressApplication>(
        AppModule.register(options)
    );

    logger.log(`AppModule loaded`);
    const configService = app.get(ConfigService);
    const userService = await app.resolve(UsersService);
    const users = configService.get<any>("users");

    const seedSingleUser = async (userData, password) => {
        return userService
            .register({ ...userData, password })
            .then(async (user) => {
                logger.log(`${userData.email} seeded`);
                return user;
            })
            .catch((e) => {
                logger.error("error", e);
                logger.log(`Error while seeding ${userData.email}`);
                return null;
            });
    };
    // Using await Promise.all to force loop to finish before continuing
    await Promise.all(
        users.map(async (userData) =>
            seedSingleUser(userData, userData.password)
        )
    );

    logger.log("Seed is finished");
    await app.close();
}

initApp();
