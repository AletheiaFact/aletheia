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
 */
export async function up(db: Db) {
    const now = new Date();

    // Helper function to extract date from ObjectId
    const getCreationDateFromObjectId = (id: any): Date => {
        if (id instanceof ObjectId) {
            return id.getTimestamp();
        }
        return now;
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
        "topics",
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
        try {
            const collection = db.collection(collectionName);
            const documents = await collection.find({}).toArray();

            if (documents.length === 0) {
                console.log(`  - ${collectionName}: No documents found, skipping`);
                continue;
            }

            const bulkOps = documents.map((doc) => {
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
            });

            if (bulkOps.length > 0) {
                await collection.bulkWrite(bulkOps);
                console.log(`  - ${collectionName}: Updated ${bulkOps.length} documents`);
            }
        } catch (error) {
            console.log(`  - ${collectionName}: Collection not found or error occurred, skipping`);
        }
    }

    // Add timestamps to collections with date field
    console.log("\nAdding timestamps to collections with date field...");
    for (const { name: collectionName, dateField } of collectionsWithDateField) {
        try {
            const collection = db.collection(collectionName);
            const documents = await collection.find({}).toArray();

            if (documents.length === 0) {
                console.log(`  - ${collectionName}: No documents found, skipping`);
                continue;
            }

            const bulkOps = documents.map((doc) => {
                // Use the date field if it exists, otherwise extract from ObjectId
                const createdAt = doc[dateField]
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
            });

            if (bulkOps.length > 0) {
                await collection.bulkWrite(bulkOps);
                console.log(`  - ${collectionName}: Updated ${bulkOps.length} documents`);
            }
        } catch (error) {
            console.log(`  - ${collectionName}: Collection not found or error occurred, skipping`);
        }
    }

    // Special case: badges collection (has created_at as string, need to add updatedAt)
    console.log("\nUpdating badges collection...");
    try {
        const badgesCollection = db.collection("badges");
        const badges = await badgesCollection.find({}).toArray();

        if (badges.length > 0) {
            const bulkOps = badges.map((doc) => {
                const createdAt = doc.created_at
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
            });

            await badgesCollection.bulkWrite(bulkOps);
            console.log(`  - badges: Updated ${bulkOps.length} documents`);
        } else {
            console.log(`  - badges: No documents found, skipping`);
        }
    } catch (error) {
        console.log(`  - badges: Collection not found or error occurred, skipping`);
    }

    // Special case: comments collection (has createdAt but missing updatedAt)
    console.log("\nUpdating comments collection...");
    try {
        const commentsCollection = db.collection("comments");
        const comments = await commentsCollection.find({}).toArray();

        if (comments.length > 0) {
            const bulkOps = comments.map((doc) => {
                const createdAt = doc.createdAt
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
            });

            await commentsCollection.bulkWrite(bulkOps);
            console.log(`  - comments: Updated ${bulkOps.length} documents`);
        } else {
            console.log(`  - comments: No documents found, skipping`);
        }
    } catch (error) {
        console.log(`  - comments: Collection not found or error occurred, skipping`);
    }

    // Special case: wikidatacaches collection (has createdAt but missing updatedAt)
    console.log("\nUpdating wikidatacaches collection...");
    try {
        const wikidataCollection = db.collection("wikidatacaches");
        const wikidatas = await wikidataCollection.find({}).toArray();

        if (wikidatas.length > 0) {
            const bulkOps = wikidatas.map((doc) => {
                const createdAt = doc.createdAt
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
            });

            await wikidataCollection.bulkWrite(bulkOps);
            console.log(`  - wikidatacaches: Updated ${bulkOps.length} documents`);
        } else {
            console.log(`  - wikidatacaches: No documents found, skipping`);
        }
    } catch (error) {
        console.log(`  - wikidatacaches: Collection not found or error occurred, skipping`);
    }

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
        const badges = await badgesCollection.find({}).toArray();

        if (badges.length > 0) {
            const bulkOps = badges.map((doc) => ({
                updateOne: {
                    filter: { _id: doc._id },
                    update: {
                        $set: {
                            created_at: doc.createdAt ? doc.createdAt.toISOString() : new Date().toISOString(),
                        },
                    },
                },
            }));

            await badgesCollection.bulkWrite(bulkOps);
            console.log(`  - badges: Restored created_at for ${bulkOps.length} documents`);
        }
    } catch (error) {
        console.log(`  - badges: Collection not found or error occurred, skipping`);
    }

    console.log("\nTimestamp rollback completed!");
}
