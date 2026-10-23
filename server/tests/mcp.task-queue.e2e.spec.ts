import { randomUUID } from "crypto";
import { getModelToken } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
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

    // Three accounts, as the manual's four-eyes rule needs: the writer, a
    // second checker who cross-checks, and a reviewer who publishes.
    const WRITER_ID = "62585756d665dc7bf4b14ac1";
    const CHECKER_ID = "62585756d665dc7bf4b14ac2";
    const writerUser = () => ({
        ...adminUser(),
        _id: WRITER_ID,
        id: WRITER_ID,
        role: { main: "fact-checker" },
    });
    const checkerUser = () => ({
        ...adminUser(),
        _id: CHECKER_ID,
        id: CHECKER_ID,
        role: { main: "fact-checker" },
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

    const reviewLog = {
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

    it("runs a task through write, cross-check, review and publish", async () => {
        const dataHash = await startWriting(
            "Frase para o fluxo completo do agente."
        );

        // write in two saves, then submit
        const draft = await callOk("save_review_log", {
            dataHash,
            summary: reviewLog.summary,
        });
        expect(draft.task.state).toBe("assigned");
        expect(draft.reviewLog.missing).toEqual(
            expect.arrayContaining(["classification", "report", "sources"])
        );
        const saved = await callOk("save_review_log", {
            dataHash,
            ...reviewLog,
        });
        expect(saved.reviewLog).toMatchObject({ ...reviewLog, missing: [] });

        const stored = await reviewTasks()
            .findOne({ data_hash: dataHash })
            .lean();
        expect(stored.machine.value).toEqual({ assigned: "draft" });
        expect(stored.machine.context.reviewData.visualEditor.type).toBe("doc");
        expect(
            stored.machine.context.reviewData.reviewDataHtml.report
        ).toContain("<sup>1</sup>");

        expect((await callOk("submit_report", { dataHash })).state).toBe(
            "reported"
        );

        // review is refused before an agreeing cross-check
        const early = await callTool(mcp.app, "send_to_review", { dataHash });
        expect(early.result.isError).toBe(true);

        expect((await callOk("send_to_cross_check", { dataHash })).state).toBe(
            "selectCrossChecker"
        );
        // the writer cannot cross-check their own report
        const own = await callOk("claim_cross_check");
        expect(own.task?.dataHash).not.toBe(dataHash);

        authState.user = checkerUser();
        let claimed: any;
        do {
            ({ task: claimed } = await callOk("claim_cross_check"));
        } while (claimed && claimed.dataHash !== dataHash);
        expect(claimed.state).toBe("cross-checking");
        expect(claimed.crossCheckerId).toBe(CHECKER_ID);
        // independent check: the writer's label is not handed out
        expect(claimed).not.toHaveProperty("classification");
        expect(claimed).not.toHaveProperty("summary");

        const checked = await callOk("submit_cross_check", {
            dataHash,
            classification: "false",
            comment: "Conferi a base oficial; o número é 100.",
        });
        // an agreeing cross-check goes straight to the review backlog
        expect(checked.state).toBe("selectReviewer");
        expect(checked.crossCheck.classification).toBe("false");

        // neither the writer nor the cross-checker may review it
        authState.user = { ...checkerUser(), role: { main: "reviewer" } };
        const byChecker = await callOk("claim_review_task");
        expect(byChecker.task?.dataHash).not.toBe(dataHash);

        authState.user = reviewerUser();
        let taken: any;
        do {
            taken = await callOk("claim_review_task");
        } while (taken.task && taken.task.dataHash !== dataHash);
        const review = taken.task;
        expect(review.state).toBe("submitted");
        // the reviewer gets the form and the claim with the task
        expect(taken.reviewLog).toMatchObject({ ...reviewLog, missing: [] });
        expect(taken.claim.claimId).toBe(review.claimId);
        expect(taken.claim.sentences.find((s: any) => s.isTask)?.dataHash).toBe(
            dataHash
        );

        const published = await callOk("publish_review_task", { dataHash });
        expect(published.state).toBe("published");
        // and the published ClaimReview comes back with the publish
        expect(published.claimReview).toMatchObject({
            isPublished: true,
            classification: "false",
        });
        expect(published.claimReview.report).toContain("<sup>1</sup>");

        const claimReview = await claimReviews()
            .findOne({ data_hash: dataHash })
            .lean();
        expect(claimReview?.isPublished).toBe(true);

        const again = await callTool(mcp.app, "publish_review_task", {
            dataHash,
        });
        expect(again.result.isError).toBe(true);
    });

    it("sends a report back to its writer when the cross-check disagrees", async () => {
        const dataHash = await startWriting(
            "Frase para discordância do cross-check."
        );
        await callOk("save_review_log", { dataHash, ...reviewLog });
        // submit and send to cross-check in one call
        expect(
            (
                await callOk("submit_report", {
                    dataHash,
                    sendToCrossCheck: true,
                })
            ).state
        ).toBe("selectCrossChecker");

        authState.user = checkerUser();
        let taken: any;
        do {
            taken = await callOk("claim_cross_check");
        } while (taken.task && taken.task.dataHash !== dataHash);
        const claimed = taken.task;
        // the claim comes with the task; the writer's label does not
        expect(taken.claim.sentences.some((s: any) => s.isTask)).toBe(true);
        expect(claimed).not.toHaveProperty("classification");
        const checked = await callOk("submit_cross_check", {
            dataHash,
            classification: "misleading",
            comment: "O número de 150 aparece em outra série; é enganoso.",
        });
        expect(checked.state).toBe("assigned");

        authState.user = writerUser();
        const { task, reviewLog: log } = await callOk("get_review_log", {
            dataHash,
        });
        expect(task.crossCheck).toEqual({
            classification: "misleading",
            comment: "O número de 150 aparece em outra série; é enganoso.",
        });
        expect(log.classification).toBe("false");

        // rework, resubmit: the old cross-check no longer counts
        await callOk("save_review_log", {
            dataHash,
            classification: "misleading",
        });
        await callOk("submit_report", { dataHash });
        const blocked = await callTool(mcp.app, "send_to_review", { dataHash });
        expect(blocked.result.isError).toBe(true);
    });

    it("sends a task back to its writer when the reviewer rejects it", async () => {
        const dataHash = await startWriting("Frase para rejeição do revisor.");
        await callOk("save_review_log", { dataHash, ...reviewLog });
        await callOk("submit_report", { dataHash });
        // a reported task with an agreeing cross-check, without the steps above
        await reviewTasks().updateOne(
            { data_hash: dataHash },
            {
                $set: {
                    "machine.value": "selectReviewer",
                    "machine.context.reviewData.reviewerId": null,
                    "machine.context.reviewData.crossCheckingClassification":
                        "false",
                },
            }
        );
        authState.user = reviewerUser();
        let review: any;
        do {
            ({ task: review } = await callOk("claim_review_task"));
        } while (review && review.dataHash !== dataHash);

        const rejected = await callOk("reject_review_task", {
            dataHash,
            rejectionComment: "Falta a fonte primária do número citado.",
        });
        expect(rejected.state).toBe("assigned");
        expect(rejected.rejectionComment).toBe(
            "Falta a fonte primária do número citado."
        );
    });

    it("add_review_comment never returns the author's email or Ory id", async () => {
        const dataHash = await startWriting(
            "Frase para comentário sem dados pessoais."
        );
        const body = await callTool(mcp.app, "add_review_comment", {
            dataHash,
            comment: "Comentário",
            text: "Comentário",
        });
        const text = body.result.content[0].text;
        expect(body.result.isError).toBeFalsy();
        expect(text).not.toMatch(/email|oryId/);
        expect(JSON.parse(text).comment.user).toEqual({
            _id: WRITER_ID,
            name: "Agent Writer",
        });
        await callOk("release_review_task", { dataHash, reason: "other" });
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
