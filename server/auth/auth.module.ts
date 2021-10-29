import { Module } from "@nestjs/common";
import { UsersModule } from "../users/users.module";
import { PassportModule } from "@nestjs/passport";
import { LocalStrategy } from "./local.strategy";
import { LocalSerializer } from "./local.serializer";

@Module({
    imports: [UsersModule, PassportModule.register({ session: true })],
    providers: [LocalStrategy, LocalSerializer],
})
export class AuthModule {}
