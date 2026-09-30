/**
 * Backend-neutral source entity shape. Mirrors the Mongo schema fields; the
 * Postgres `toEntity()` mapper exposes `_id` (Mongo-parity alias) alongside
 * `id`. Loose typing on purpose — callers today consume lean Mongoose docs.
 */
export interface ISource {
    _id?: any;
    id?: any;
    href: string;
    props?: Record<string, any> | null;
    targetId?: any[];
    user?: any;
    data_hash: string;
    nameSpace?: string;
    createdAt?: Date;
    updatedAt?: Date;
    [key: string]: any;
}
