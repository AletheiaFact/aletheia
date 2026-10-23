import { MongoClient } from "mongodb";
import { AdminUserMock } from "./AdminUserMock";
import { getTestDbName } from "./getTestDbName";

/**
 * Seeds two NameSpace documents (collection "namespaces", see
 * server/auth/name-space/schemas/name-space.schema.ts) used by the MCP
 * namespace-membership e2e tests:
 *  - "secret": the seeded admin user (AdminUserMock) is a member.
 *  - "forbidden": no members, so any user is rejected.
 */
export const SeedTestNameSpace = async (uri: string) => {
    const client = await new MongoClient(uri);
    await client.connect();

    try {
        const operations = [
            {
                updateOne: {
                    filter: { slug: "secret" },
                    update: {
                        $set: {
                            name: "Secret",
                            slug: "secret",
                            users: [AdminUserMock._id],
                        },
                    },
                    upsert: true,
                },
            },
            {
                updateOne: {
                    filter: { slug: "forbidden" },
                    update: {
                        $set: {
                            name: "Forbidden",
                            slug: "forbidden",
                            users: [],
                        },
                    },
                    upsert: true,
                },
            },
        ];

        const result = await client
            .db(getTestDbName(uri))
            .collection("namespaces")
            .bulkWrite(operations);

        return { acknowledged: result.ok === 1 };
    } finally {
        await client.close();
    }
};
