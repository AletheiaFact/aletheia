import { ParserService } from "./parser.service";
import { Module } from "@nestjs/common";

@Module({
    exports: [ParserService],
    providers: [ParserService],
})
export class ParserModule {}
