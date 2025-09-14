import { Injectable, BadRequestException } from "@nestjs/common";
import { Model, isValidObjectId } from "mongoose";
import { NameSpaceDocument, NameSpace } from "./schemas/name-space.schema";
import { InjectModel } from "@nestjs/mongoose";
import { UpdateNameSpaceDTO } from "./dto/update-name-space.dto";
import { NotificationService } from "../../notifications/notifications.service";

@Injectable()
export class NameSpaceService {
    constructor(
        @InjectModel(NameSpace.name)
        private NameSpaceModel: Model<NameSpaceDocument>,
        private notificationService: NotificationService
    ) {}

    listAll() {
        return this.NameSpaceModel.find().populate("users");
    }

    findByUser(userId: string) {
        if (!userId || typeof userId !== "string") {
            throw new BadRequestException("User ID must be a non-empty string");
        }

        if (!isValidObjectId(userId)) {
            throw new BadRequestException("Invalid user ID format");
        }

        return this.NameSpaceModel.find({ users: userId }).exec();
    }

    async create(nameSpace) {
        const newNameSpace = await new this.NameSpaceModel(nameSpace).save();

        await this.notificationService.createTopic(
            newNameSpace._id,
            newNameSpace.name
        );
        if (newNameSpace.users.length > 0) {
            await this.notificationService.addTopicSubscriber(
                newNameSpace._id,
                newNameSpace.users
            );
        }
        return newNameSpace;
    }

    async update(id, newNameSpace: UpdateNameSpaceDTO) {
        const isNameSpaceTopic = await this.notificationService.getTopic(
            newNameSpace._id
        );

        await this.ensureTopicAndSubscribers(
            id,
            newNameSpace.name,
            newNameSpace.users,
            isNameSpaceTopic
        );

        return await this.NameSpaceModel.updateOne(
            { _id: newNameSpace._id },
            newNameSpace
        );
    }

    async ensureTopicAndSubscribers(
        namespaceId,
        namespaceName,
        users,
        isNameSpaceTopic
    ) {
        if (!isNameSpaceTopic) {
            await this.notificationService.createTopic(
                namespaceId,
                namespaceName
            );
        }
        await this.notificationService.addTopicSubscriber(namespaceId, users);
    }

    findOne(match) {
        return this.NameSpaceModel.findOne(match);
    }

    getById(_id: string) {
        if (!_id || typeof _id !== "string") {
            throw new BadRequestException("ID must be a non-empty string");
        }

        if (!isValidObjectId(_id)) {
            throw new BadRequestException("Invalid ID format");
        }

        return this.NameSpaceModel.findById(_id);
    }
}
