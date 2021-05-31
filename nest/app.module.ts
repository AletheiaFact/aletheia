import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";

const mongodb_host = process.env.MONGODB_HOST || "localhost";
const mongodb_name = process.env.MONGODB_NAME || "Aletheia";

@Module({
    imports: [
        MongooseModule.forRoot(`mongodb://${mongodb_host}/${mongodb_name}`, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
        }),
        UsersModule,
        AuthModule,
    ],
})
export class AppModule {}
