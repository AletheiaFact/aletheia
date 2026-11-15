import { Controller, Put, Get, Inject } from "@nestjs/common";
import type { IImageService } from "../../../interfaces/image.service.interface";
import { ApiTags } from "@nestjs/swagger";
import { ZodBody, ZodParam } from "../../../common/validation";
import { dataHash } from "../../../../lib/schemas";
import { ContentTopicsSchema } from "../../dto/claim.dto";
import type { ContentTopicsDto } from "../../dto/claim.dto";

@Controller()
export class ImageController {
    constructor(@Inject("ImageService") private imageService: IImageService) {}

    @ApiTags("claim")
    @Get("api/image/:data_hash")
    getSentenceByHash(@ZodParam("data_hash", dataHash) data_hash: string) {
        return this.imageService.getByDataHash(data_hash);
    }

    @ApiTags("claim")
    @Put("api/image/:data_hash")
    update(
        @ZodParam("data_hash", dataHash) data_hash: string,
        @ZodBody(ContentTopicsSchema) topics: ContentTopicsDto
    ) {
        return this.imageService.updateImageWithTopics(topics, data_hash);
    }
}
