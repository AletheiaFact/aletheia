import { Db, ObjectId } from "mongodb";

export async function up(db: Db) {
    try {
        const topics = await db
            .collection("topics")
            .find({
                createdAt: { $exists: false },
            })
            .toArray();

        console.log(`Migrating ${topics.length} topics to add timestamps...`);

        if (topics.length === 0) {
            console.log("No topics to migrate.");
            return;
        }

        const bulkOps = topics.map((topic) => {
            const createdAt = (topic._id as ObjectId).getTimestamp();

            return {
                updateOne: {
                    filter: { _id: topic._id },
                    update: {
                        $set: {
                            createdAt: createdAt,
                            updatedAt: createdAt,
                        },
                    },
                },
            };
        });

        const result = await db.collection("topics").bulkWrite(bulkOps);
        console.log(`Successfully migrated ${result.modifiedCount} topics.`);
    } catch (error) {
        console.error("Error during migration:", error);
        throw error;
    }
}

export async function down(db: Db) {
    try {
        await db
            .collection("topics")
            .updateMany({}, { $unset: { createdAt: "", updatedAt: "" } });
        console.log("Removed timestamps from all topics.");
    } catch (error) {
        console.error("Error during migration rollback:", error);
        throw error;
    }
}
