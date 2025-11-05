import { Db } from "mongodb";

export async function up(db: Db) {
    const collectionName = "chatbotstates";

    const chatBotStates = await db
        .collection(collectionName)
        .find({})
        .toArray();

    console.log(`Found ${chatBotStates.length} chatbot states to update`);

    if (chatBotStates.length === 0) {
        console.log("No chatbot states found.");
        return;
    }

    for (const state of chatBotStates) {
        const channel = state._id.toString().split("-")[0];

        if (state.machine?.context && !state.machine.context.sourceChannel) {
            await db.collection(collectionName).updateOne(
                { _id: state._id },
                {
                    $set: {
                        "machine.context.sourceChannel": channel,
                    },
                }
            );
            console.log(
                `Updated chatbot state ${state._id} with sourceChannel: ${channel}`
            );
        } else if (state.machine?.context?.sourceChannel) {
            console.log(
                `Chatbot state ${state._id} already has sourceChannel: ${state.machine.context.sourceChannel}`
            );
        } else {
            console.log(
                `Skipping chatbot state ${state._id} - no context found`
            );
        }
    }

    console.log("Migration completed successfully");
}
