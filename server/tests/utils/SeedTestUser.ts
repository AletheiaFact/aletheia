import { MongoClient } from 'mongodb'
import { UserMock } from "./UserMock";

export const SeedTestUser = async (uri) => {
    const client = await new MongoClient(uri);
    await client.connect()

    try {
        return await client
            .db("Aletheia")
            .collection("users")
            .insertOne(UserMock);
    } finally {
        await client.close();
    }
}
