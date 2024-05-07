import { IsArray, IsNotEmpty, IsString } from "class-validator";

/**
 * Data Transfer Object for an individual message.
 *
 * This class represents a single message, defining its structure and applying
 * validation rules. It ensures that each message has a specified role and content,
 * both of which are non-empty strings.
 *
 * @class MessageDto
 *
 * @property role - The role associated with the message, e.g., 'user', 'bot'.
 *                  It is validated to be a non-empty string.
 * @property content - The actual content of the message.
 *                     It is validated to be a non-empty string.
 */
export class MessageDto {
    @IsNotEmpty()
    @IsString()
    role: string;

    @IsNotEmpty()
    @IsString()
    content: string;
}

/**
 * Data Transfer Object for a collection of messages.
 *
 * This class is used to handle an array of MessageDto objects. It ensures that
 * the collection of messages is not empty and that each element of the array
 * is a valid MessageDto instance.
 *
 * @class ContextAwareMessagesDto
 *
 * @property messages - An array of MessageDto objects.
 *                      It is validated to be a non-empty array.
 */
export class ContextAwareMessagesDto {
    @IsNotEmpty()
    @IsArray()
    messages: MessageDto[];
}
