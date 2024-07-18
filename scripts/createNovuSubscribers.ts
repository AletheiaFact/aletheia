/**
 * Script to create Novu subscribers and add them to a topic.
 *
 * Usage:
 * Run the following command to create subscribers and add them to a specified topic:
 * yarn create-novu-subscribers <topicKey> "<email1,email2,...>"
 */
import { Novu } from "@novu/node";
import { v4 as uuidv4 } from "uuid";

if (!process.env.NOVU_API_KEY) {
    console.error("NOVU_API_KEY is not set in the environment variables.");
    process.exit(1);
}

const novu = new Novu(`${process.env.NOVU_API_KEY}`);

const args = process.argv.slice(2);

if (args.length < 2) {
    console.error(
        "Usage: yarn create-novu-subscribers <topicKey> <email1,email2,...>"
    );
    process.exit(1);
}

const topicKey = args[0];
const emails = args[1].split(",");

const subscriberIds: string[] = [];

const createSubscribers = async (emails: string[]) => {
    for (const email of emails) {
        const [firstName, domain] = email.split("@");
        const subscriberId = uuidv4();
        subscriberIds.push(subscriberId);

        try {
            await novu.subscribers.identify(subscriberId, {
                firstName,
                email,
            });
            console.log(
                `Subscriber created: ${firstName} (${email}) with ID: ${subscriberId}`
            );
        } catch (error) {
            console.error(`Failed to create subscriber for ${email}:`, error);
        }
    }
};

const addSubscribersToTopic = async (
    topicKey: string,
    subscribers: string[]
) => {
    try {
        const result = await novu.topics.addSubscribers(topicKey, {
            subscribers,
        });
        console.log(`Subscribers added to topic ${topicKey}:`, result);
    } catch (error) {
        console.error(`Failed to add subscribers to topic ${topicKey}:`, error);
    }
};

const main = async () => {
    try {
        await createSubscribers(emails);

        await addSubscribersToTopic(topicKey, subscriberIds);
    } catch (error) {
        console.error("Error:", error);
    }
};

main();
