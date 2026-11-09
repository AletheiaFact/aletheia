import { randomUUID } from "crypto";
import { getModelToken } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import {
    adminUser,
    authState,
    callTool,
    useMcpTestHelper,
} from "./McpTestHelper";

// A reviewer who did not write the report (four-eyes).
export const REVIEWER_ID = "62585756d665dc7bf4b14ab9";
export const reviewerUser = () => ({
    ...adminUser(),
    _id: REVIEWER_ID,
    id: REVIEWER_ID,
    role: { main: "reviewer" },
});

// Three accounts, as the manual's four-eyes rule needs: the writer, a
// second checker who cross-checks, and a reviewer who publishes.
export const WRITER_ID = "62585756d665dc7bf4b14ac1";
export const CHECKER_ID = "62585756d665dc7bf4b14ac2";
export const writerUser = () => ({
    ...adminUser(),
    _id: WRITER_ID,
    id: WRITER_ID,
    role: { main: "fact-checker" },
});
export const checkerUser = () => ({
    ...adminUser(),
    _id: CHECKER_ID,
    id: CHECKER_ID,
    role: { main: "fact-checker" },
});

export const reviewLog = {
    classification: "false",
    summary: "O número citado não confere com o dado oficial.",
    questions: ["Qual é o dado oficial?", "O número citado confere?"],
    report: "O dado oficial é 100.\nO discurso citou 150.",
    verification: "Consultamos a base oficial do instituto.",
    sources: [
        {
            href: "https://example.org/base-oficial",
            field: "report",
            quotedText: "O dado oficial é 100",
        },
    ],
};

/**
 * Shared setup for the task-queue e2e specs: the MCP app listening on a
 * port, the stored users comments are attributed to, and the helpers that
 * create claims and drive a task. Call it inside a `describe`.
 */
export function useMcpQueueHelper() {
    const mcp = useMcpTestHelper();
    // supertest opens a new ephemeral listener per request unless the server
    // is already listening; dozens of concurrent listeners reset connections.
    beforeAll(async () => {
        await mcp.app.listen(0);
    });

    // Comments (the cross-check) are attributed to a stored user.
    beforeAll(async () => {
        const users = mcp.app.get(getModelToken("User")) as Model<any>;
        for (const [id, name] of [
            [WRITER_ID, "Agent Writer"],
            [CHECKER_ID, "Agent Checker"],
            [REVIEWER_ID, "Agent Reviewer"],
        ]) {
            await users.updateOne(
                { _id: new Types.ObjectId(id) },
                {
                    $setOnInsert: {
                        name,
                        email: `${id}@agents.test`,
                        oryId: `ory-${id}`,
                        role: { main: "fact-checker" },
                    },
                },
                { upsert: true }
            );
        }
    });

    const reviewTasks = () =>
        mcp.app.get(getModelToken("ReviewTask")) as Model<any>;
    const claimReviews = () =>
        mcp.app.get(getModelToken("ClaimReview")) as Model<any>;

    const callOk = async (name: string, args: any = {}) => {
        const body = await callTool(mcp.app, name, args);
        const text = body.result?.content?.[0]?.text ?? JSON.stringify(body);
        if (body.result?.isError || body.error) {
            throw new Error(`${name} failed: ${text}`);
        }
        return JSON.parse(text);
    };

    const createClaim = async (content: string) => {
        const stamp = randomUUID();
        const personality = await callOk("create_personality", {
            name: `Queue Person ${stamp}`,
            description: "Queue e2e",
            wikidata: `Q-queue-${stamp}`,
        });
        return callOk("create_claim", {
            title: `Queue claim ${stamp}`,
            content,
            date: new Date().toISOString(),
            sources: [`https://example.org/queue-${stamp}`],
            personalityId: personality._id,
        });
    };

    /** Creates a one-sentence claim and assigns its task to the writer. */
    const startWriting = async (sentence: string, writer = writerUser) => {
        authState.user = adminUser();
        const claim = await createClaim(sentence);
        const [queued] = await reviewTasks().find({ target: claim._id }).lean();
        authState.user = writer();
        await callOk("start_review_task", {
            claimId: claim._id,
            dataHash: queued.data_hash,
        });
        return queued.data_hash as string;
    };

    return {
        mcp,
        reviewTasks,
        claimReviews,
        callOk,
        createClaim,
        startWriting,
    };
}
