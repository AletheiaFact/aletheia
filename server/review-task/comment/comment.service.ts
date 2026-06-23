import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    Logger,
    NotFoundException,
} from "@nestjs/common";
import {
    ClientSession,
    isValidObjectId,
    Model,
    Types,
    UpdateQuery,
} from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Comment, CommentDocument } from "./schema/comment.schema";
import { UsersService } from "../../users/users.service";
import { UpdateCommentDTO } from "./dto/create-comment.dto";

@Injectable()
export class CommentService {
    private readonly logger = new Logger(CommentService.name);

    constructor(
        @InjectModel(Comment.name)
        private CommentModel: Model<CommentDocument>,
        private usersService: UsersService
    ) {}

    async create(comment: any) {
        comment.user = new Types.ObjectId(comment.user);
        const [user, newComment] = await Promise.all([
            this.usersService.getById(comment.user),
            new this.CommentModel(comment).save(),
        ]);

        return {
            ...newComment.toObject(),
            user,
        };
    }

    async updateManyComments(comments: any[]) {
        await Promise.all(
            comments.map((comment) => this.update(comment?._id, comment))
        );
    }

    async update(id: string, UpdateCommentDto: UpdateCommentDTO) {
        try {
            this.logger.debug(`Updating comment ${id}`, { UpdateCommentDto });

            if (!isValidObjectId(id)) {
                throw new BadRequestException(
                    `Invalid comment ID format: ${id}`
                );
            }

            const { user, ...otherFields } = UpdateCommentDto;

            const updateData: UpdateQuery<Comment> = { ...otherFields };

            if (user) {
                updateData.user = new Types.ObjectId(
                    typeof user === "string" ? user : user._id
                );
            }

            const updatedComment = await this.CommentModel.findByIdAndUpdate(
                id,
                { $set: updateData },
                { new: true, runValidators: true }
            ).populate("user", "name");

            if (!updatedComment) {
                throw new NotFoundException(`Comment not found: ${id}`);
            }

            return updatedComment;
        } catch (error: any) {
            this.logger.error(`Failed to update comment [${id}]`, error.stack);

            if (
                error instanceof NotFoundException ||
                error instanceof BadRequestException
            ) {
                throw error;
            }

            if (error.name === "CastError") {
                throw new BadRequestException(
                    `Invalid format for field: ${error.path}`
                );
            }

            throw new InternalServerErrorException(
                "Unexpected error during comment update"
            );
        }
    }

    async createReplyComment(id: string, commentBody: any) {
        const existingComment = await this.CommentModel.findById(id);
        if (!existingComment) {
            throw new NotFoundException(`Comment not found: ${id}`);
        }
        const newComment = await this.create({
            ...commentBody,
            targetId: existingComment._id,
            isReply: true,
        });

        existingComment.replies.push(newComment._id as Types.ObjectId);
        await existingComment.save();

        return newComment;
    }

    async deleteReplyComment(id: string, replyId: string) {
        const comment = await this.CommentModel.findById(id);
        if (!comment) {
            throw new NotFoundException(`Comment not found: ${id}`);
        }

        const replies = comment.replies.filter((reply: any) => {
            return !new Types.ObjectId(reply?._id).equals(replyId);
        });

        await this.CommentModel.updateOne(
            { _id: comment._id },
            { $set: { replies } }
        );

        return { ...comment.toObject(), replies };
    }

    async cascadeUpdateSentenceTarget(
        oldSentenceId: Types.ObjectId | string,
        newSentenceId: Types.ObjectId | string,
        session: ClientSession
    ): Promise<number> {
        const result = await this.CommentModel.updateMany(
            { targetId: oldSentenceId },
            { $set: { targetId: newSentenceId } },
            { session }
        );
        return result.modifiedCount ?? 0;
    }
}
