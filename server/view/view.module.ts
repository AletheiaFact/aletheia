import { Module } from "@nestjs/common";
import { ViewController } from "./view.controller";
import { ViewService } from "./view.service";
import {ConfigModule} from "@nestjs/config";

@Module({
    imports: [ConfigModule],
    providers: [ViewService],
    controllers: [ViewController],
    exports: [ViewService]
})
export class ViewModule {}
