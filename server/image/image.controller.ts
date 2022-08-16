import { Controller, Post, Body, Req } from "@nestjs/common";
import { ImageService } from "./image.service";

@Controller()
export class ImageController {
    constructor(private imageService: ImageService) {}

    @Post("api/image")
    async create(@Body() image, @Req() req) {
        return this.imageService.create(image, req?.user);
    }
}
