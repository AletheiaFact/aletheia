import { Body, Controller, Post, Req } from "@nestjs/common";
import { ImageService } from "./image.service";

@Controller()
export class ImageController {
    constructor(private imageService: ImageService) {}

    @Post("api/image")
    async create(@Body() imageBody, @Req() req) {
        return this.imageService.create(imageBody, req?.user);
    }
}
