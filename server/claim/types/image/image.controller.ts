import { Controller, Param, Put, Body, Get } from "@nestjs/common";
import { ImageService } from "./image.service";

@Controller()
export class ImageController {
    constructor(private imageService: ImageService) {}

    @Get("api/image/:data_hash")
    getSentenceByHash(@Param("data_hash") data_hash) {
        return this.imageService.getByDataHash(data_hash);
    }

    @Put("api/image/:data_hash")
    update(@Param("data_hash") data_hash, @Body() topics) {
        return this.imageService.updateImageWithTopics(topics, data_hash);
    }
}
