import { ConfigService } from "@nestjs/config";

// FIXME: Find a better way to inject configService directly into modules
export default {
    type: new ConfigService().get<string>("db.type") || "mongodb",
};
