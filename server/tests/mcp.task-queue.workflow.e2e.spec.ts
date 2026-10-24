import { adminUser, authState, callTool } from "./utils/McpTestHelper";
import {
    CHECKER_ID,
    checkerUser,
    reviewerUser,
    reviewLog,
    useMcpQueueHelper,
    WRITER_ID,
    writerUser,
} from "./utils/McpQueueHelper";
import { FeatureFlagService } from "../feature-flag/feature-flag.service";

describe("MCP task queue: write, cross-check, review (e2e)", () => {
    const {
        mcp,
        reviewTasks,
        claimReviews,
        callOk,
        createClaim,
        startWriting,
    } = useMcpQueueHelper();

    it("keeps an rncd-debate task on its own labels from writing to publish", async () => {
        // Prototype, not app.get(): modules that list FeatureFlagService in
        // their own providers get separate instances
        const flag = vi
            .spyOn(
                FeatureFlagService.prototype,
                "isEnableClassificationMethodology"
            )
            .mockReturnValue(true);
        try {
            authState.user = adminUser();
            const claim = await createClaim(
                "Frase para checar na escala RNCD."
            );
            const [queued] = await reviewTasks()
                .find({ target: claim._id })
                .lean();
            const dataHash = queued.data_hash as string;

            authState.user = writerUser();
            const started = await callOk("start_review_task", {
                claimId: claim._id,
                dataHash,
                classificationMethodology: "rncd-debate",
            });
            expect(started.classificationMethodology).toBe("rncd-debate");

            // a label the RNCD scale does not offer cannot be saved
            const offScale = await callTool(mcp.app, "save_review_log", {
                dataHash,
                ...reviewLog,
                classification: "exaggerated",
            });
            expect(offScale.result.isError).toBe(true);
            expect(offScale.result.content[0].text).toMatch(/not an option/);

            const saved = await callOk("save_review_log", {
                dataHash,
                ...reviewLog,
                classification: "trustworthy",
            });
            expect(saved.reviewLog).toMatchObject({
                classification: "trustworthy",
                classificationMethodology: "rncd-debate",
                classificationLabel: { pt: "Verdadeiro", en: "True" },
                missing: [],
            });
            await callOk("submit_report", {
                dataHash,
                sendToCrossCheck: true,
            });

            authState.user = checkerUser();
            let claimed: any;
            do {
                ({ task: claimed } = await callOk("claim_cross_check"));
            } while (claimed && claimed.dataHash !== dataHash);
            // the cross-checker learns the scale, not the writer's label
            expect(claimed.classificationMethodology).toBe("rncd-debate");
            expect(claimed.methodologyName.pt).toBe("RNCD Debate");
            expect(claimed).not.toHaveProperty("classification");
            expect(claimed).not.toHaveProperty("classificationLabel");

            const offScaleCheck = await callTool(
                mcp.app,
                "submit_cross_check",
                {
                    dataHash,
                    classification: "exaggerated",
                    comment: "Conferi a base oficial.",
                }
            );
            expect(offScaleCheck.result.isError).toBe(true);

            const checked = await callOk("submit_cross_check", {
                dataHash,
                classification: "trustworthy",
                comment: "Conferi a base oficial.",
            });
            expect(checked.state).toBe("selectReviewer");
            expect(checked.crossCheck.classificationLabel.pt).toBe(
                "Verdadeiro"
            );

            authState.user = reviewerUser();
            let taken: any;
            do {
                taken = await callOk("claim_review_task");
            } while (taken.task && taken.task.dataHash !== dataHash);
            expect(taken.reviewLog.classificationLabel.pt).toBe("Verdadeiro");

            const published = await callOk("publish_review_task", {
                dataHash,
            });
            expect(published.state).toBe("published");
            expect(published.claimReview).toMatchObject({
                classification: "trustworthy",
                classificationMethodology: "rncd-debate",
                classificationLabel: { pt: "Verdadeiro", en: "True" },
            });
        } finally {
            flag.mockRestore();
        }
    });

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
            classificationLabel: { pt: "Enganoso", en: "Misleading" },
            classificationMethodology: "aletheia",
            methodologyName: { pt: "Aletheia", en: "Aletheia" },
            comment: "O número de 150 aparece em outra série; é enganoso.",
            // worded on the task's (default) methodology
            classificationMethodology: "aletheia",
            methodologyName: { pt: "Aletheia", en: "Aletheia" },
            classificationLabel: { pt: "Enganoso", en: "Misleading" },
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
});
