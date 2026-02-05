import { Db, ObjectId } from "mongodb";

const HEX24 = /^[0-9a-fA-F]{24}$/;

export async function up(db: Db) {
    try {
        const historiesToChange = await db
            .collection("histories")
            .find({ user: { $type: "string", $regex: HEX24 } })
            .toArray();

        if (historiesToChange.length === 0) {
            console.log("No histories with string users to change.");
        } else {
            const bulkOps = historiesToChange.map((history) => ({
                updateOne: {
                    filter: { _id: history._id },
                    update: {
                        $set: {
                            user: new ObjectId(history.user as string),
                            migration_revert_flag: true,
                        },
                    },
                },
            }));

            const result = await db.collection("histories").bulkWrite(bulkOps);
            console.log(`Converted ${result.modifiedCount} history.user fields to ObjectId.`);
        }
    } catch (error) {
        console.error("Migration UP failed:", error);
        throw error;
    }
}

export async function down(db: Db) {
    try {
        const historiesToRedefine = await db
            .collection("histories")
            .find({ migration_revert_flag: true })
            .toArray();

        if (historiesToRedefine.length === 0) return;

        const bulkOps = historiesToRedefine.map((history) => {
                const userIdString = history.user ? String(history.user) : null;

                return {
                    updateOne: {
                        filter: { _id: history._id },
                        update: { $set: { user: userIdString } },
                        $unset: { migration_revert_flag: "" },
                    },
                };
            })

        const result = await db.collection("histories").bulkWrite(bulkOps);
        console.log(`Reverted ${result.modifiedCount} fields back to strings.`);

    } catch (error) {
        console.error("Migration DOWN failed:", error);
        throw error;
    }
}