/**
 * @interface ILogger
 */
export interface ILogger {
    /**
     * @param {string} level - trace|debug|info|warn|error|fatal
     * @param {object | string} content - mesage or object to output
     */
    log: (level: string, content: object | string) => void;
}
