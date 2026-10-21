/**
 * Backend-neutral topic entity shape. Mirrors the Mongo schema fields; the
 * Postgres `toEntity()` mapper exposes `_id` (Mongo-parity alias callers read)
 * alongside `id`. Loose typing on purpose — callers today consume Mongoose
 * documents.
 */
export interface ITopic {
    _id?: any;
    id?: any;
    slug: string;
    name: string;
    wikidataId?: string;
    aliases?: string[];
    language: string;
    createdAt?: Date;
    updatedAt?: Date;
    [key: string]: any;
}
