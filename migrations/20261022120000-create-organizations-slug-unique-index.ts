import { Db } from "mongodb";

/**
 * Organizations (event participants) are looked up and deduplicated by slug,
 * derived from the name. The unique index turns a concurrent duplicate create
 * into an E11000, mapped to 409 by MongoOrganizationService.
 *
 * Partial on isDeleted: false so a soft-deleted organization does not block
 * creating a new one with the same name. Mirrors the index declared on
 * OrganizationSchema, for environments where autoIndex is off.
 */
const INDEX_KEY = { slug: 1 } as const;

const INDEX_NAME = "slug_1";

export async function up(db: Db) {
    const collection = db.collection("organizations");
    await collection.createIndex(INDEX_KEY, {
        name: INDEX_NAME,
        unique: true,
        partialFilterExpression: { isDeleted: false },
    });
    console.log(`  - organizations: created index ${INDEX_NAME}`);
}

export async function down(db: Db) {
    const collection = db.collection("organizations");
    try {
        await collection.dropIndex(INDEX_NAME);
        console.log(`  - organizations: dropped index ${INDEX_NAME}`);
    } catch (error) {
        console.log(
            `  - organizations: index ${INDEX_NAME} not found, skipping`
        );
    }
}
