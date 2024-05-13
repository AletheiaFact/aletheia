function customMessage(statusCode: number, message: string, data = {}): object {
    return {
        statusCode: statusCode,
        message: [message],
        data: data,
    };
}
export default customMessage;
