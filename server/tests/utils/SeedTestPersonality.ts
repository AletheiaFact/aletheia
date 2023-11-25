import { MongoClient } from "mongodb";
import { PersonalitiesMock } from "./PersonalitiesMock";

export const SeedTestPersonality = async (uri) => {
    const client = await new MongoClient(uri);
    await client.connect();

    try {
        return await client
            .db("Aletheia")
            .collection("personalities")
            .insertMany(PersonalitiesMock);
    } finally {
        await client.close();
    }
};
