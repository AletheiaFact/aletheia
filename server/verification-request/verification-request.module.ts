import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import {
    VerificationRequest,
    VerificationRequestSchema,
} from "./schema/verification-request.schema";
import { VerificationRequestService } from "./verification-request.service";

const VerificationRequestModel = MongooseModule.forFeature([
    {
        name: VerificationRequest.name,
        schema: VerificationRequestSchema,
    },
]);

@Module({
    imports: [VerificationRequestModel],
    providers: [VerificationRequestService],
    exports: [VerificationRequestService],
})
export class VerificationRequestModule {}
