/**
 * Enum for standardized message responses.
 *
 * MESSAGES.BAD_REQUEST - Used for indicating a bad or invalid request.
 * MESSAGES.SUCCESS - Used to indicate successful completion of an operation.
 * MESSAGES.EXTERNAL_SERVER_ERROR - Used to indicate that an error has occured on server end.
 */
export enum MESSAGES {
    BAD_REQUEST = "bad request",
    SUCCESS = "success",
    EXTERNAL_SERVER_ERROR = "Something went wrong, please try again later",
}
