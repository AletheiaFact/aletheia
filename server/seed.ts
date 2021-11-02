import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import Logger from "./logger";
import { NestExpressApplication } from "@nestjs/platform-express";
import { EmailService } from "./email/email.service";
import { ConfigService } from "@nestjs/config";
import { UsersService } from "./users/users.service";
import { randomBytes } from "crypto";

const mongodb_host = process.env.MONGODB_HOST || "localhost";
const mongodb_name = process.env.MONGODB_NAME || "Aletheia";

const initApp = async (options) => {
    options.db = {
        connection_uri: `mongodb://${mongodb_host}/${mongodb_name}`,
        options: {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
        }
    }
    options.logger.log("info", `Loading AppModule`);
    const app = await NestFactory.create<NestExpressApplication>(
        AppModule.register(options),
        {
            logger: new Logger(options.logger) || undefined
        }
    );
    options.logger.log("info", `AppModule loaded`);
    const emailService = app.get(EmailService);
    const configService = app.get(ConfigService);
    const userService = app.get(UsersService);
    const users = configService.get<any>("users");
    const disableSMTP = configService.get<any>("disable_smtp");

    const generatePassword = (isTestUser = false) => {
        const buf = randomBytes(8);

        if (isTestUser) {
            return process.env.DEVELOPMENT_PASSWORD;
        }

        return buf.toString("hex");
    };

    const seedSingleUser = async (userData, password) => {
        return userService.register({ ...userData, password})
            .then(async (user) => {
                options.logger.log("info", `${userData.email} seeded`);
                if (userData.sendAuthDetails && !disableSMTP) {
                    const emailResponse = await emailService.sendEmail(
                        userData.email,
                        "Bem-vinda(o) a Aletheia",
                        "Voce poderá acessar o sistema usando as credenciais abaixo",
                        { ...userData, password },
                        "./templates/userSeed.html"
                    );
                    options.logger.log("info", emailResponse);
                    options.logger.log("info", `E-mail sent to ${userData.email}`);
                }
                return user;
            })
            .catch((e) => {
                options.logger.log("error", e);
                options.logger.log("info", `Error while seeding ${userData.email}`);
                return null;
            });
    };
    // Using await Promise.all to force loop to finish before continuing
    await Promise.all(
        users.map(async (userData) => {
            const password = generatePassword(userData.isTestUser);
            return seedSingleUser(userData, password);
        })
    );

    options.logger.log(
        "info",
        "Seed is finished"
    );
    await app.close();
};

module.exports = initApp;
