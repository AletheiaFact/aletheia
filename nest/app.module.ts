import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UsersModule } from "./users/users.module";

const mongodb_host = process.env.MONGODB_HOST || "localhost";
const mongodb_name = process.env.MONGODB_NAME || "Aletheia";

@Module({
    imports: [
        MongooseModule.forRoot(`mongodb://${mongodb_host}/${mongodb_name}`),
        UsersModule,
    ],
})
export class AppModule {}
