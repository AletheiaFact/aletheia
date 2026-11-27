import { Db } from "mongodb";

/**
 * The Wikidata cache expired after 24 hours, so every personality was fetched
 * again from Wikidata each day. With over 1,000 personalities (and two Commons
 * requests for each one with an image) this ran into the Wikimedia rate limit.
 *
 * This changes the TTL of the existing `createdAt_1` index on
 * `wikidatacaches` to 7 days, the value of WIKIDATA_CACHE_TTL_SECONDS in
 * `server/wikidata/wikidata.service.ts`. Mongoose does not change the TTL of
 * an index that exists, so a `collMod` is necessary.
 */
const COLLECTION = "wikidatacaches";
const NEW_TTL_SECONDS = 7 * 24 * 60 * 60;
const OLD_TTL_SECONDS = 24 * 60 * 60;

async function setTtl(db: Db, expireAfterSeconds: number) {
    const collections = await db
        .listCollections({ name: COLLECTION }, { nameOnly: true })
        .toArray();
    if (collections.length === 0) {
        // The app creates the collection with the correct TTL on first use.
        return;
    }

    const indexes = await db.collection(COLLECTION).indexes();
    const ttlIndex = indexes.find(
        (index) =>
            index.key?.createdAt === 1 &&
            Object.keys(index.key).length === 1 &&
            index.expireAfterSeconds !== undefined
    );

    if (!ttlIndex) {
        await db
            .collection(COLLECTION)
            .createIndex({ createdAt: 1 }, { expireAfterSeconds });
        return;
    }

    await db.command({
        collMod: COLLECTION,
        index: { keyPattern: { createdAt: 1 }, expireAfterSeconds },
    });
}

export async function up(db: Db) {
    await setTtl(db, NEW_TTL_SECONDS);
}

export async function down(db: Db) {
    await setTtl(db, OLD_TTL_SECONDS);
}
