import { randomUUID } from "crypto";
import { getModelToken } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AdminUserMock } from "./utils/AdminUserMock";
import {
    adminUser,
    authState,
    callTool,
    useMcpTestHelper,
} from "./utils/McpTestHelper";

// A reviewer who did not write the report (four-eyes).
const REVIEWER_ID = "62585756d665dc7bf4b14ab9";
const reviewerUser = () => ({
    ...adminUser(),
    _id: REVIEWER_ID,
    id: REVIEWER_ID,
    role: { main: "reviewer" },
});

describe("MCP task queue (e2e)", () => {
    const mcp = useMcpTestHelper();
    // supertest opens a new ephemeral listener per request unless the server
    // is already listening; dozens of concurrent listeners reset connections.
    beforeAll(async () => {
        await mcp.app.listen(0);
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

    it("create_claim feeds the queue with one unassigned task per sentence", async () => {
        const claim = await createClaim(
            "Primeira frase do discurso. Segunda frase do discurso. Terceira frase do discurso."
        );
        expect(claim.queuedReviewTasks).toBe(3);

        const tasks = await reviewTasks().find({ target: claim._id }).lean();
        expect(tasks).toHaveLength(3);
        for (const task of tasks) {
            expect(task.machine.value).toBe("unassigned");
            expect(task.machine.context.reviewData.usersId).toEqual([]);
            expect(task.reportModel).toBe("Fact-checking");
        }
    });

    it("hands each unassigned task to exactly one of many concurrent callers", async () => {
        await createClaim(
            "Uma frase. Outra frase. Mais uma frase. Quarta frase. Quinta frase."
        );
        const waiting = await reviewTasks().countDocuments({
            "machine.value": "unassigned",
            nameSpace: "main",
        });
        expect(waiting).toBeGreaterThanOrEqual(5);

        const results = await Promise.all(
            Array.from({ length: waiting + 3 }, () =>
                callOk("next_review_task")
            )
        );
        const handedOut = results.map((r) => r.task?.dataHash).filter(Boolean);

        expect(handedOut).toHaveLength(waiting);
        expect(new Set(handedOut).size).toBe(waiting);
        expect(results.filter((r) => r.task === null)).toHaveLength(3);

        const assigned = await reviewTasks()
            .find({ data_hash: { $in: handedOut } })
            .lean();
        for (const task of assigned) {
            expect(task.machine.value).toEqual({ assigned: "undraft" });
            expect(task.machine.context.reviewData.usersId.map(String)).toEqual(
                [AdminUserMock._id.toString()]
            );
        }
    });

    it("runs a task from the queue to a published ClaimReview, skipping cross-checking", async () => {
        await createClaim("Frase para publicar no fluxo completo.");
        // drain anything older so this test gets its own sentence
        let task: any;
        do {
            ({ task } = await callOk("next_review_task"));
        } while (task && !/publicar/.test(task.sentence ?? ""));
        expect(task?.sentence).toMatch(/publicar/);

        // The report itself is written in the web editor; store a finished one.
        await reviewTasks().updateOne(
            { data_hash: task.dataHash },
            {
                $set: {
                    "machine.value": "reported",
                    "machine.context.reviewData.classification": "false",
                    "machine.context.reviewData.summary": "Resumo.",
                    "machine.context.reviewData.report": "Relatório.",
                    "machine.context.reviewData.verification": "Verificação.",
                    "machine.context.reviewData.questions": ["Procede?"],
                    "machine.context.reviewData.sources": [
                        { href: "https://example.org/fonte" },
                    ],
                },
            }
        );

        const sent = await callOk("send_to_review", {
            dataHash: task.dataHash,
        });
        expect(sent.state).toBe("selectReviewer");
        expect(sent.reviewerId).toBeNull();

        // the author cannot review their own report
        authState.user = { ...adminUser(), role: { main: "reviewer" } };
        const own = await callOk("claim_review_task");
        expect(own.task?.dataHash).not.toBe(task.dataHash);

        authState.user = reviewerUser();
        const claimed = await callOk("claim_review_task");
        expect(claimed.task.dataHash).toBe(task.dataHash);
        expect(claimed.task.state).toBe("submitted");
        expect(claimed.task.reviewerId).toBe(REVIEWER_ID);

        const mine = await callOk("list_my_review_tasks");
        expect(mine.tasks.map((t: any) => t.dataHash)).toContain(task.dataHash);

        const published = await callOk("publish_review_task", {
            dataHash: task.dataHash,
        });
        expect(published.state).toBe("published");

        // ClaimReview creation is fire-and-forget, as on the web path
        let review: any = null;
        for (let i = 0; i < 50 && !review; i++) {
            review = await claimReviews()
                .findOne({ data_hash: task.dataHash })
                .lean();
            if (!review) await new Promise((r) => setTimeout(r, 100));
        }
        expect(review).toBeTruthy();
        expect(review.isPublished).toBe(true);

        const again = await callTool(mcp.app, "publish_review_task", {
            dataHash: task.dataHash,
        });
        expect(again.result.isError).toBe(true);
    });

    it("join_review_task adds a co-checker once", async () => {
        await createClaim("Frase para juntar ajudantes.");
        let task: any;
        do {
            ({ task } = await callOk("next_review_task"));
        } while (task && !/ajudantes/.test(task.sentence ?? ""));
        expect(task).toBeTruthy();

        authState.user = reviewerUser();
        await callOk("join_review_task", { dataHash: task.dataHash });
        const joined = await callOk("join_review_task", {
            dataHash: task.dataHash,
        });
        expect(joined.assignees).toEqual([
            AdminUserMock._id.toString(),
            REVIEWER_ID,
        ]);
    });
});
