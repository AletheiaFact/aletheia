import { Db } from "mongodb";

export async function up(db: Db) {
    try {
        await db
            .collection("topics")
            .updateMany(
                { aliases: { $exists: false } },
                { $set: { aliases: [] } }
            );

        // Special case: Add "COP30" alias to the specific Wikidata entity
        // Q115323194 = Conferência das Nações Unidas sobre as Mudanças Climáticas de 2025
        await db
            .collection("topics")
            .updateOne(
                { wikidataId: "Q115323194" },
                { $set: { aliases: ["COP30"] } }
            );
        console.log("Successfully added aliases field to topics.");
    } catch (error) {
        console.error("Error during migration:", error);
        throw error;
    }
}

export async function down(db: Db) {
    try {
        await db
            .collection("topics")
            .updateMany(
                { aliases: { $exists: true } },
                { $unset: { aliases: "" } }
            );
        console.log("Removed aliases field from all topics.");
    } catch (error) {
        console.error("Error during migration rollback:", error);
        throw error;
    }
}
