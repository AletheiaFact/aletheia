import { ApiProperty, ApiPropertyOptional, OmitType } from "@nestjs/swagger";
import {
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
} from "class-validator";
import { UserDocument } from "../../../users/schemas/user.schema";
import { CommentEnum } from "../schema/comment.schema";

export class CreateCommentDTO {
    @IsOptional()
    @IsNumber()
    @ApiPropertyOptional()
    from?: number;

    @IsOptional()
    @IsNumber()
    @ApiPropertyOptional()
    to?: number;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    comment: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    text: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    user: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    targetId: string;
}

export class CreateReplyCommentDTO extends OmitType(CreateCommentDTO, [
    "targetId",
] as const) {}

export class UpdateCommentDTO {
    @IsOptional()
    @IsString()
    @ApiPropertyOptional()
    comment?: string;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional()
    text?: string;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional()
    user?: UserDocument;

    @IsOptional()
    @ApiPropertyOptional()
    resolved?: boolean;

    @IsOptional()
    @IsEnum(CommentEnum)
    @ApiPropertyOptional({ enum: CommentEnum })
    type?: CommentEnum;
}

export class DeleteReplyDTO {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    replyCommentId: string;
}
