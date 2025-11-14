import { Db, ObjectId } from "mongodb";

/**
 * Migration to add timestamps (createdAt and updatedAt) to collections
 * that are missing them.
 *
 * For existing documents:
 * - If the document has an ObjectId _id, we extract the creation date from it
 * - If the collection has a 'date' field, we use it as createdAt
 * - Otherwise, we use the current date
 * - updatedAt is set to createdAt for existing documents
 *
 * Note: We keep the original 'date' fields for now to track all date parameters
 * being used on the platform before fully migrating to the new createdAt values.
 */
export async function up(db: Db) {
    const now = new Date();
    const BATCH_SIZE = 1000;

    // Helper function to extract date from ObjectId
    const getCreationDateFromObjectId = (id: any): Date => {
        if (id instanceof ObjectId) {
            return id.getTimestamp();
        }
        return now;
    };

    // Helper function to validate date
    const isValidDate = (date: any): boolean => {
        if (!date) return false;
        const dateObj = new Date(date);
        return !isNaN(dateObj.getTime());
    };

    // Helper function to process collection in batches using cursor
    const processCollectionInBatches = async (
        collectionName: string,
        processBatch: (docs: any[]) => any[]
    ) => {
        try {
            const collection = db.collection(collectionName);
            const cursor = collection.find({});
            let batch: any[] = [];
            let totalProcessed = 0;

            while (await cursor.hasNext()) {
                const doc = await cursor.next();
                if (doc) {
                    batch.push(doc);
                }

                if (batch.length >= BATCH_SIZE) {
                    const bulkOps = processBatch(batch);
                    if (bulkOps.length > 0) {
                        await collection.bulkWrite(bulkOps);
                        totalProcessed += bulkOps.length;
                    }
                    batch = [];
                }
            }

            // Process remaining documents
            if (batch.length > 0) {
                const bulkOps = processBatch(batch);
                if (bulkOps.length > 0) {
                    await collection.bulkWrite(bulkOps);
                    totalProcessed += bulkOps.length;
                }
            }

            if (totalProcessed > 0) {
                console.log(`  - ${collectionName}: Updated ${totalProcessed} documents`);
            } else {
                console.log(`  - ${collectionName}: No documents found, skipping`);
            }
        } catch (error) {
            console.log(`  - ${collectionName}: Collection not found or error occurred, skipping`);
        }
    };

    // Collections with no timestamps at all
    const collectionsWithoutTimestamps = [
        "namespaces",
        "images",
        "paragraphs",
        "sentences",
        "unattributeds",
        "dailyreports",
        "editors",
        "groups",
        "reviewtasks",
        "sources",
        "users",
        "claims",
        "speeches",
        "personalities",
        "reports",
        "chatbotstates",
    ];

    // Collections that have a 'date' field that can be used as createdAt
    const collectionsWithDateField = [
        { name: "stateevents", dateField: "date" },
        { name: "claimreviews", dateField: "date" },
        { name: "claimrevisions", dateField: "date" },
        { name: "histories", dateField: "date" },
        { name: "verificationrequests", dateField: "date" },
    ];

    // Add timestamps to collections without any timestamp fields
    console.log("Adding timestamps to collections without timestamp fields...");
    for (const collectionName of collectionsWithoutTimestamps) {
        await processCollectionInBatches(collectionName, (docs) =>
            docs.map((doc) => {
                const createdAt = getCreationDateFromObjectId(doc._id);
                return {
                    updateOne: {
                        filter: { _id: doc._id },
                        update: {
                            $set: {
                                createdAt: createdAt,
                                updatedAt: createdAt,
                            },
                        },
                    },
                };
            })
        );
    }

    // Add timestamps to collections with date field
    console.log("\nAdding timestamps to collections with date field...");
    for (const { name: collectionName, dateField } of collectionsWithDateField) {
        await processCollectionInBatches(collectionName, (docs) =>
            docs.map((doc) => {
                // Use the date field if it exists and is valid, otherwise extract from ObjectId
                const createdAt =
                    doc[dateField] && isValidDate(doc[dateField])
                        ? new Date(doc[dateField])
                        : getCreationDateFromObjectId(doc._id);

                return {
                    updateOne: {
                        filter: { _id: doc._id },
                        update: {
                            $set: {
                                createdAt: createdAt,
                                updatedAt: createdAt,
                            },
                        },
                    },
                };
            })
        );
    }

    // Special case: badges collection (has created_at as string, need to add updatedAt)
    console.log("\nUpdating badges collection...");
    await processCollectionInBatches("badges", (docs) =>
        docs.map((doc) => {
            const createdAt =
                doc.created_at && isValidDate(doc.created_at)
                    ? new Date(doc.created_at)
                    : getCreationDateFromObjectId(doc._id);

            return {
                updateOne: {
                    filter: { _id: doc._id },
                    update: {
                        $set: {
                            createdAt: createdAt,
                            updatedAt: createdAt,
                        },
                        $unset: {
                            created_at: "", // Remove old string field
                        },
                    },
                },
            };
        })
    );

    // Special case: comments collection (has createdAt but missing updatedAt)
    console.log("\nUpdating comments collection...");
    await processCollectionInBatches("comments", (docs) =>
        docs.map((doc) => {
            const createdAt =
                doc.createdAt && isValidDate(doc.createdAt)
                    ? new Date(doc.createdAt)
                    : getCreationDateFromObjectId(doc._id);

            return {
                updateOne: {
                    filter: { _id: doc._id },
                    update: {
                        $set: {
                            createdAt: createdAt,
                            updatedAt: createdAt,
                        },
                    },
                },
            };
        })
    );

    // Special case: wikidatacaches collection (has createdAt but missing updatedAt)
    console.log("\nUpdating wikidatacaches collection...");
    await processCollectionInBatches("wikidatacaches", (docs) =>
        docs.map((doc) => {
            const createdAt =
                doc.createdAt && isValidDate(doc.createdAt)
                    ? new Date(doc.createdAt)
                    : getCreationDateFromObjectId(doc._id);

            return {
                updateOne: {
                    filter: { _id: doc._id },
                    update: {
                        $set: {
                            createdAt: createdAt,
                            updatedAt: createdAt,
                        },
                    },
                },
            };
        })
    );

    console.log("\nTimestamp migration completed!");
}

export async function down(db: Db) {
    // Remove createdAt and updatedAt from all collections
    const allCollections = [
        "namespaces",
        "badges",
        "images",
        "paragraphs",
        "sentences",
        "unattributeds",
        "dailyreports",
        "editors",
        "groups",
        "reviewtasks",
        "sources",
        "stateevents",
        "topics",
        "users",
        "claimreviews",
        "claimrevisions",
        "claims",
        "speeches",
        "personalities",
        "reports",
        "histories",
        "verificationrequests",
        "chatbotstates",
        "comments",
        "wikidatacaches",
    ];

    console.log("Removing timestamps from collections...");
    for (const collectionName of allCollections) {
        try {
            const collection = db.collection(collectionName);
            await collection.updateMany(
                {},
                {
                    $unset: {
                        createdAt: "",
                        updatedAt: "",
                    },
                }
            );
            console.log(`  - ${collectionName}: Removed timestamps`);
        } catch (error) {
            console.log(`  - ${collectionName}: Collection not found or error occurred, skipping`);
        }
    }

    // Restore the old created_at field for badges
    console.log("\nRestoring badges created_at field...");
    try {
        const badgesCollection = db.collection("badges");
        const cursor = badgesCollection.find({});
        const BATCH_SIZE = 1000;
        let batch: any[] = [];

        while (await cursor.hasNext()) {
            const doc = await cursor.next();
            if (doc) {
                batch.push(doc);
            }

            if (batch.length >= BATCH_SIZE) {
                const bulkOps = batch.map((doc) => ({
                    updateOne: {
                        filter: { _id: doc._id },
                        update: {
                            $set: {
                                created_at: doc.createdAt ? doc.createdAt.toISOString() : new Date().toISOString(),
                            },
                        },
                    },
                }));

                if (bulkOps.length > 0) {
                    await badgesCollection.bulkWrite(bulkOps);
                }
                batch = [];
            }
        }

        // Process remaining documents
        if (batch.length > 0) {
            const bulkOps = batch.map((doc) => ({
                updateOne: {
                    filter: { _id: doc._id },
                    update: {
                        $set: {
                            created_at: doc.createdAt ? doc.createdAt.toISOString() : new Date().toISOString(),
                        },
                    },
                },
            }));

            if (bulkOps.length > 0) {
                await badgesCollection.bulkWrite(bulkOps);
            }
        }

        console.log(`  - badges: Restored created_at field`);
    } catch (error) {
        console.log(`  - badges: Collection not found or error occurred, skipping`);
    }

    console.log("\nTimestamp rollback completed!");
}
