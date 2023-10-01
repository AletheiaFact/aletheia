import { Db } from "mongodb";
import { Novu } from "@novu/node";
import config from "../migrate-mongo-config";

export async function up(db: Db) {
    /* Create novu subscribers */
    const novuApiKey = await config.novu_api_key;
    const novu = new Novu(novuApiKey);

    const usersCursor = await db.collection("users").find();
    while (await usersCursor.hasNext()) {
        const { _id, email, name } = await usersCursor.next();

        await novu.subscribers.identify(_id, {
            email,
            firstName: name,
        });
    }
}

export async function down(db: Db) {
    /* Delete novu subscribers */
    const novuApiKey = await config.novu_api_key;
    const novu = new Novu(novuApiKey);

    const usersCursor = await db.collection("users").find();
    while (await usersCursor.hasNext()) {
        const user = await usersCursor.next();

        await novu.subscribers.delete(user.id);
    }
}
