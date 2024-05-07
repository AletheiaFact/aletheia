import { IsArray, IsNotEmpty, IsString } from "class-validator";

/**
 * Data Transfer Object for an individual message.
 *
 * This class represents a single message, defining its structure and applying
 * validation rules. It ensures that each message has a specified sender and content,
 * both of which are non-empty strings.
 *
 * @class MessageDto
 *
 * @property sender - The sender associated with the message, e.g., 'You', 'Assistant'.
 *                  It is validated to be a non-empty string.
 * @property content - The actual content of the message.
 *                     It is validated to be a non-empty string.
 */
export class ContextAwareMessagesDto {
    @IsNotEmpty()
    @IsString()
    sender: string;

    @IsNotEmpty()
    @IsString()
    content: string;
}
