import { Db } from "mongodb";
import { Novu } from "@novu/node";
import config from "../migrate-mongo-config";

export async function up(db: Db) {
    // migrations not needed
    /* Create novu subscribers */
    const novuApiKey = await config.novu_api_key;
    const novu = new Novu(novuApiKey);

    const usersCursor = await db.collection("users").find();
    while (await usersCursor.hasNext()) {
        const user = await usersCursor.next();
        if (!user) {
            continue;
        }
        const { _id, email, name } = user;

        await novu.subscribers.identify(_id.toString(), {
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

        await novu.subscribers.delete(user?.id);
    }
}
