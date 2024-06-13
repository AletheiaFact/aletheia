import { ConfigService } from "@nestjs/config";

export default {
    type: new ConfigService().get<string>("db.type") || "mongodb",
};
