import { AdminUserMock } from "./utils/AdminUserMock";
import { callTool, authState } from "./utils/McpTestHelper";
import {
    REVIEWER_ID,
    reviewerUser,
    useMcpQueueHelper,
    writerUser,
} from "./utils/McpQueueHelper";

describe("MCP task queue: hand-out (e2e)", () => {
    const { mcp, reviewTasks, callOk, createClaim, startWriting } =
        useMcpQueueHelper();

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

    it("lets a writer hold one task at a time and give it back", async () => {
        // a writer with no other open task
        const soloWriter = () => ({
            ...writerUser(),
            _id: "62585756d665dc7bf4b14ac3",
            id: "62585756d665dc7bf4b14ac3",
        });
        const dataHash = await startWriting(
            "Frase para devolver à fila.",
            soloWriter
        );

        const refused = await callTool(mcp.app, "next_review_task", {});
        expect(refused.result.isError).toBe(true);

        const released = await callOk("release_review_task", {
            dataHash,
            reason: "not-checkable",
            note: "Não é uma afirmação.",
        });
        expect(released.state).toBe("unassigned");

        // the queue does not hand it back to the same writer
        let next: any;
        const seen: string[] = [];
        do {
            ({ task: next } = await callOk("next_review_task"));
            if (next) {
                seen.push(next.dataHash);
                await callOk("release_review_task", {
                    dataHash: next.dataHash,
                    reason: "other",
                });
            }
        } while (next);
        expect(seen).not.toContain(dataHash);
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
