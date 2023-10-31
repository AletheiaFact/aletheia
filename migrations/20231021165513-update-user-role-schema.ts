import { Db } from "mongodb";

export async function up(db: Db) {
    const usersCursor = await db.collection("users").find();

    while (await usersCursor.hasNext()) {
        const user = await usersCursor.next();

        await db
            .collection("users")
            .updateOne(
                { _id: user._id },
                { $set: { role: { main: user.role } } }
            );
    }
}

export async function down(db: Db) {
    const usersCursor = await db.collection("users").find();

    while (await usersCursor.hasNext()) {
        const user = await usersCursor.next();

        await db
            .collection("users")
            .updateOne({ _id: user._id }, { $set: { role: user.role.main } });
    }
}
