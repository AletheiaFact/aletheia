import { AdminUserMock } from "./utils/AdminUserMock";
import { FeatureFlagService } from "../feature-flag/feature-flag.service";
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

    it("carries the classification methodology from the queue to the published review", async () => {
        // Prototype, not app.get(): modules that list FeatureFlagService in
        // their own providers get separate instances
        const flag = vi
            .spyOn(
                FeatureFlagService.prototype,
                "isEnableClassificationMethodology"
            )
            .mockReturnValue(true);
        try {
            await createClaim("Frase para checar na escala RNCD.");
            let task: any;
            do {
                ({ task } = await callOk("next_review_task", {
                    classificationMethodology: "rncd-debate",
                }));
            } while (task && !/escala RNCD/.test(task.sentence ?? ""));
            expect(task?.classificationMethodology).toBe("rncd-debate");

            // The report itself is written in the web editor; store one
            // whose classification the RNCD scale does not offer.
            await reviewTasks().updateOne(
                { data_hash: task.dataHash },
                {
                    $set: {
                        "machine.value": "selectReviewer",
                        "machine.context.reviewData.classification":
                            "exaggerated",
                        "machine.context.reviewData.summary": "Resumo.",
                        "machine.context.reviewData.report": "Relatório.",
                        "machine.context.reviewData.verification":
                            "Verificação.",
                        "machine.context.reviewData.questions": ["Procede?"],
                        "machine.context.reviewData.sources": [
                            { href: "https://example.org/fonte-rncd" },
                        ],
                    },
                }
            );
            authState.user = reviewerUser();
            const claimed = await callOk("claim_review_task");
            expect(claimed.task.dataHash).toBe(task.dataHash);
            expect(claimed.task.classificationMethodology).toBe("rncd-debate");

            const refused = await callTool(mcp.app, "publish_review_task", {
                dataHash: task.dataHash,
            });
            expect(refused.result.isError).toBe(true);
            expect(refused.result.content[0].text).toMatch(/not an option/);

            await reviewTasks().updateOne(
                { data_hash: task.dataHash },
                {
                    $set: {
                        "machine.context.reviewData.classification":
                            "trustworthy",
                    },
                }
            );
            const published = await callOk("publish_review_task", {
                dataHash: task.dataHash,
            });
            expect(published.state).toBe("published");
            expect(published.classificationLabel.pt).toBe("Verdadeiro");

            // ClaimReview creation is fire-and-forget, as on the web path
            let review: any = null;
            for (let i = 0; i < 50 && !review?.report; i++) {
                review = await callOk("get_claim_review", {
                    dataHash: task.dataHash,
                });
                if (!review?.report)
                    await new Promise((r) => setTimeout(r, 100));
            }
            expect(review.report.classification).toBe("trustworthy");
            expect(review.report.classificationMethodology).toBe("rncd-debate");
            expect(review.report.classificationLabel).toEqual({
                pt: "Verdadeiro",
                en: "True",
            });
        } finally {
            flag.mockRestore();
        }
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
