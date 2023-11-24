import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { NestExpressApplication } from "@nestjs/platform-express";
import { ConfigService } from "@nestjs/config";
import { UsersService } from "./users/users.service";
import { UtilService } from "./util";
import loadConfig from "./configLoader";
import { WinstonLogger } from "./winstonLogger";

async function initApp() {
    const options = loadConfig();

    const logger = new WinstonLogger();
    const app = await NestFactory.create<NestExpressApplication>(
        AppModule.register(options)
    );

    logger.log(`AppModule loaded`);
    const emailService = app.get(EmailService);
    const configService = app.get(ConfigService);
    const userService = app.get(UsersService);
    const utilService = app.get(UtilService);
    const users = configService.get<any>("users");

    const seedSingleUser = async (userData, password) => {
        return userService
            .register({ ...userData, password })
            .then(async (user) => {
                logger.log(`${userData.email} seeded`);
                if (userData.sendAuthDetails && !disableSMTP) {
                    const emailResponse = await emailService.sendEmail(
                        userData.email,
                        "Bem-vinda(o) a Aletheia",
                        "Você poderá acessar o sistema usando as credenciais abaixo",
                        { ...userData, password },
                        "./templates/userSeed.html"
                    );
                    logger.log(emailResponse);
                    logger.log(`E-mail sent to ${userData.email}`);
                }
                return user;
            })
            .catch((e) => {
                logger.error("error", e);
                logger.log(`Error while seeding ${userData.email}`);
                return null;
            });
    };

    console.log(users, "seed users");
    // Using await Promise.all to force loop to finish before continuing
    await Promise.all(
        users.map(async (userData) => {
            const password = utilService.generatePassword(
                userData.isTestUser,
                userData.password
            );
            return seedSingleUser(userData, password);
        })
    ).catch((e) => {
        options.logger.log("error", e);
        options.logger.log("info", "Error while seeding users");
    });

    logger.log("Seed is finished");
    await app.close();
}

initApp();
