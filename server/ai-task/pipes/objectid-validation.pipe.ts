import { PipeTransform, Injectable, BadRequestException } from "@nestjs/common";
import { isValidObjectId } from "mongoose";

@Injectable()
export class ObjectIdValidationPipe implements PipeTransform {
    transform(value: string): string {
        if (!isValidObjectId(value)) {
            throw new BadRequestException(`Invalid ObjectId format: ${value}`);
        }
        return value;
    }
}
