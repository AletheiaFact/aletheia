/**
 * Database-layer error types. Errors thrown from database backends (mongo,
 * postgres) and mapped to HTTP responses by AllExceptionsFilter live here.
 */

/**
 * Thrown by database-backend services when a method is not implemented for
 * the configured backend (e.g., a Postgres impl whose dependency module has
 * not yet been ported from MongoDB).
 *
 * NOTE: this is intentionally NOT a NestJS `NotImplementedException`. The
 * `NotImplementedException` from `@nestjs/common` is a generic 501 with no
 * structured payload; this class carries `{ backend, method }` so clients
 * and observability tooling can identify which deferred operation was hit.
 * Both are mapped to HTTP 501 by `AllExceptionsFilter`.
 */
export class NotImplementedError extends Error {
    public readonly backend: string;
    public readonly method: string;

    constructor(backend: string, method: string) {
        super(
            `Method '${method}' is not implemented for backend '${backend}'.`
        );
        this.name = "NotImplementedError";
        this.backend = backend;
        this.method = method;
        Object.setPrototypeOf(this, NotImplementedError.prototype);
    }
}
