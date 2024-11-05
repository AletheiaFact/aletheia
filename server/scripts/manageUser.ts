import { NestFactory } from "@nestjs/core";
import { AppModule } from "../app.module";
import { NestExpressApplication } from "@nestjs/platform-express";
import { ConfigService } from "@nestjs/config";
import { UsersService } from "../users/users.service";
import loadConfig from "../configLoader";
import { WinstonLogger } from "../winstonLogger";
import OryService from "../auth/ory/ory.service";

// Helper function to parse command-line arguments
const parseArgs = () => {
    const args = process.argv.slice(2); // Skip the first two elements
    const command = args[0]; // Positional argument (e.g., "update")
    const options: Record<string, string> = {};

    // Parse arguments starting with "--"
    args.slice(1).forEach((arg) => {
        const [key, value] = arg.split("=");
        if (key.startsWith("--")) {
            options[key.slice(2)] = value;
        }
    });

    return { command, options };
};

async function updateUserAppAffiliation(userFromDB, app) {
    const oryService = await app.resolve(OryService);
    const configService = app.get(ConfigService);

    const app_affiliation = configService.get("app_affiliation");
    if (userFromDB && app_affiliation) {
        await oryService.updateIdentity(userFromDB, null, {
            app_affiliation,
            role: userFromDB.role,
        });
    }
}

async function initApp() {
    const { command, options: scriptOptions } = parseArgs();
    const options = loadConfig();

    const logger = new WinstonLogger();
    const app = await NestFactory.create<NestExpressApplication>(
        AppModule.register(options)
    );

    logger.log(`AppModule loaded`);
    // Check if the command is specified and is "update"
    if (command !== "update") {
        logger.log("Unsupported command. Use 'update' as the command.");
        process.exit(1);
    }

    const { user } = scriptOptions;
    const userService = await app.resolve(UsersService);

    const userFromDB = await userService.getByEmail(user);

    updateUserAppAffiliation(userFromDB, app);

    logger.log("Seed is finished");
    await app.close();
}

initApp();
