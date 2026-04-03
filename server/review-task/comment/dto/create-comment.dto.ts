import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

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
    user?: string;

    @IsOptional()
    @ApiPropertyOptional()
    replies?: string[];

    @IsOptional()
    @ApiPropertyOptional()
    resolved?: boolean;
}

export class DeleteReplyDTO {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    replyCommentId: string;
}
