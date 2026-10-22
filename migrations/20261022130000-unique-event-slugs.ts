import { Db, ObjectId } from "mongodb";

/**
 * Event pages move from /event/:data_hash/:slug to /event/:slug, so the slug
 * becomes the public identifier and must be unique.
 *
 * Slugs were derived from the name only, so events sharing a name (e.g. the
 * same conference in different years) share a slug. The oldest event keeps
 * it; the others get -2, -3, ... Events slugged "create" (the create page
 * route) are renamed the same way. Then a unique index enforces it, matching
 * `unique: true` on Event.slug.
 *
 * `down` only drops the index: renamed slugs are kept, since the legacy
 * /event/:data_hash/:slug route never relied on them.
 */
const INDEX_NAME = "slug_1";
const RESERVED_SLUGS = ["create"];

type SlugGroup = {
    _id: string;
    events: { _id: ObjectId; createdAt?: Date }[];
};

export async function up(db: Db) {
    const events = db.collection("events");
    const taken = new Set<string>([
        ...RESERVED_SLUGS,
        ...(await events.distinct("slug")),
    ]);

    const groups = await events
        .aggregate<SlugGroup>([
            { $sort: { createdAt: 1, _id: 1 } },
            {
                $group: {
                    _id: "$slug",
                    events: { $push: { _id: "$_id", createdAt: "$createdAt" } },
                },
            },
            {
                $match: {
                    $or: [
                        { "events.1": { $exists: true } },
                        { _id: { $in: RESERVED_SLUGS } },
                    ],
                },
            },
        ])
        .toArray();

    for (const { _id: slug, events: sameSlug } of groups) {
        const toRename = RESERVED_SLUGS.includes(slug)
            ? sameSlug
            : sameSlug.slice(1);

        for (const event of toRename) {
            let suffix = 2;
            while (taken.has(`${slug}-${suffix}`)) {
                suffix++;
            }
            const newSlug = `${slug}-${suffix}`;
            taken.add(newSlug);
            await events.updateOne(
                { _id: event._id },
                { $set: { slug: newSlug } }
            );
            console.log(`  - events: ${event._id} slug ${slug} -> ${newSlug}`);
        }
    }

    await events.createIndex({ slug: 1 }, { name: INDEX_NAME, unique: true });
    console.log(`  - events: created unique index ${INDEX_NAME}`);
}

export async function down(db: Db) {
    const events = db.collection("events");
    try {
        await events.dropIndex(INDEX_NAME);
        console.log(`  - events: dropped index ${INDEX_NAME}`);
    } catch (error) {
        console.log(`  - events: index ${INDEX_NAME} not found, skipping`);
    }
}
