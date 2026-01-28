import { Db } from "mongodb";

/**
 * Migration to remove trailing paragraphs from review tasks.
 *
 * The TrailingNodeExtension in Remirror adds an empty paragraph at the end
 * of documents to allow insertion of new nodes. This paragraph was being
 * persisted in the database, causing issues when content is loaded.
 *
 * This migration:
 * 1. Creates a backup of the reviewtasks collection before any modifications
 * 2. Removes trailing paragraphs from visualEditor.content
 * 3. Removes derived fields: paragraph and reviewDataHtml.paragraph
 * 4. Provides a rollback function to restore from backup
 */
export async function up(db: Db) {
    const COLLECTION_NAME = "reviewtasks";
    const BACKUP_COLLECTION_NAME = "reviewtasks_backup_trailing_paragraph";
    const collection = db.collection(COLLECTION_NAME);

    console.log("Starting migration: Remove trailing paragraphs from review tasks");
    console.log("Creating backup collection...");

    try {
        const backupExists = await db
            .listCollections({ name: BACKUP_COLLECTION_NAME })
            .hasNext();

        if (backupExists) {
            console.log(
                `Backup collection ${BACKUP_COLLECTION_NAME} already exists.`
            );
        } else {
            const cursor = collection.find({});
            const backupCollection = db.collection(BACKUP_COLLECTION_NAME);
            let backupCount = 0;

            for await (const doc of cursor) {
                await backupCollection.insertOne(doc);
                backupCount++;
            }

            console.log(
                `Backup created: ${backupCount} documents copied to ${BACKUP_COLLECTION_NAME}`
            );
        }
    } catch (error) {
        console.error("Error creating backup:", error);
        throw new Error("Migration aborted: Failed to create backup");
    }

    console.log("\nProcessing documents to remove trailing paragraphs...");
    const cursor = collection.find({
        "machine.context.reviewData.visualEditor.content": { $exists: true },
    });

    let processed = 0;
    let updated = 0;
    let errors = 0;

    for await (const doc of cursor) {
        try {
            processed++;
            const content =
                doc.machine?.context?.reviewData?.visualEditor?.content;

            if (!Array.isArray(content) || content.length === 0) {
                continue;
            }

            const lastItem = content[content.length - 1];
            const isTrailingParagraph = lastItem?.type === "paragraph";

            if (isTrailingParagraph) {
                const newContent = content.slice(0, -1);

                const unsetFields: Record<string, string> = {};

                if (
                    doc.machine?.context?.reviewData?.paragraph !== undefined
                ) {
                    unsetFields["machine.context.reviewData.paragraph"] = "";
                }

                if (
                    doc.machine?.context?.reviewData?.reviewDataHtml?.paragraph !==
                    undefined
                ) {
                    unsetFields[
                        "machine.context.reviewData.reviewDataHtml.paragraph"
                    ] = "";
                }

                const updateOperation: any = {
                    $set: {
                        "machine.context.reviewData.visualEditor.content":
                            newContent,
                    },
                };

                if (Object.keys(unsetFields).length > 0) {
                    updateOperation.$unset = unsetFields;
                }

                await collection.updateOne({ _id: doc._id }, updateOperation);
                updated++;

                if (updated % 100 === 0) {
                    console.log(
                        `  Processed ${processed} documents, updated ${updated}...`
                    );
                }
            }
        } catch (error) {
            errors++;
            console.error(`Error processing document ${doc._id}:`, error);
        }
    }

    console.log("\n" + "=".repeat(60));
    console.log("Migration Summary:");
    console.log(`  Documents processed: ${processed}`);
    console.log(`  Documents updated: ${updated}`);
    console.log(`  Errors: ${errors}`);
    console.log(`  Backup collection: ${BACKUP_COLLECTION_NAME}`);
    console.log("=".repeat(60));

    if (errors > 0) {
        console.warn(
            "\nSome errors occurred during migration. Check logs above."
        );
    }
}

export async function down(db: Db) {
    const COLLECTION_NAME = "reviewtasks";
    const BACKUP_COLLECTION_NAME = "reviewtasks_backup_trailing_paragraph";

    console.log("Rolling back migration: Restore from backup");
    console.log("WARNING: This will overwrite current data with backup data!");

    const backupCollection = db.collection(BACKUP_COLLECTION_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const backupExists = await db
        .listCollections({ name: BACKUP_COLLECTION_NAME })
        .hasNext();

    if (!backupExists) {
        throw new Error(
            `Backup collection ${BACKUP_COLLECTION_NAME} not found. Cannot rollback.`
        );
    }

    await collection.deleteMany({});
    console.log("  Cleared current collection");

    const cursor = backupCollection.find({});
    let restored = 0;

    for await (const doc of cursor) {
        await collection.insertOne(doc);
        restored++;
    }

    console.log(`Restored ${restored} documents from backup`);

    await backupCollection.drop();
    console.log(`Backup collection ${BACKUP_COLLECTION_NAME} deleted`);
}

