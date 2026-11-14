import { getModelToken } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { authState, callTool } from "./utils/McpTestHelper";
import {
    CHECKER_ID,
    checkerUser,
    REVIEWER_ID,
    reviewerUser,
    reviewLog,
    useMcpQueueHelper,
    WRITER_ID,
    writerUser,
} from "./utils/McpQueueHelper";

// The writer of a report picks who cross-checks and who reviews it, as
// checkers working in pairs do on the web, and the whole flow finishes
// without the platform.
describe("MCP task queue: the writer picks the cross-checker and reviewer (e2e)", () => {
    const { mcp, reviewTasks, callOk, startWriting } = useMcpQueueHelper();

    // The stored reviewer must hold the role the web picker offers for review
    beforeAll(async () => {
        const users = mcp.app.get(getModelToken("User")) as Model<any>;
        await users.updateOne(
            { _id: new Types.ObjectId(REVIEWER_ID) },
            { $set: { role: { main: "reviewer" } } }
        );
    });

    const stored = async (dataHash: string) =>
        (await reviewTasks().findOne({ data_hash: dataHash }).lean())
            ?.machine;

    const written = async (sentence: string) => {
        const dataHash = await startWriting(sentence);
        authState.user = writerUser();
        await callOk("save_review_log", { dataHash, ...reviewLog });
        return dataHash;
    };

    it("cross-check by the picked pair, review by the picked reviewer, publish", async () => {
        const dataHash = await written("O estado tem 40 hospitais.");

        const { users: checkers } = await callOk("list_assignable_users", {
            dataHash,
            for: "crossCheck",
            name: "Agent",
        });
        const ids = checkers.map((u: any) => u.id);
        expect(ids).toContain(CHECKER_ID);
        expect(ids).not.toContain(WRITER_ID);

        const sent = await callOk("submit_report", {
            dataHash,
            crossCheckerId: CHECKER_ID,
        });
        expect(sent.state).toBe("cross-checking");
        expect(sent.crossCheckerId).toBe(CHECKER_ID);

        authState.user = checkerUser();
        const { task: mine } = await callOk("next_cross_checking");
        expect(mine.dataHash).toBe(dataHash);
        const checked = await callOk("submit_cross_check", {
            dataHash,
            classification: reviewLog.classification,
            comment: "Conferi a base oficial.",
        });
        expect(checked.state).toBe("selectReviewer");

        authState.user = writerUser();
        const { users: reviewers } = await callOk("list_assignable_users", {
            dataHash,
            for: "review",
        });
        expect(reviewers.map((u: any) => u.id)).toEqual([REVIEWER_ID]);
        const inReview = await callOk("send_to_review", {
            dataHash,
            reviewerId: REVIEWER_ID,
        });
        expect(inReview.state).toBe("submitted");
        expect(inReview.reviewerId).toBe(REVIEWER_ID);

        authState.user = reviewerUser();
        const { tasks } = await callOk("list_my_review_tasks");
        expect(tasks.map((t: any) => t.dataHash)).toContain(dataHash);
        const published = await callOk("publish_review_task", { dataHash });
        expect(published.state).toBe("published");
    });

    it("sends straight to the picked reviewer without a cross-check", async () => {
        const dataHash = await written("A ponte tem 2 km.");
        const sent = await callOk("submit_report_to_review", {
            dataHash,
            reviewerId: REVIEWER_ID,
        });
        expect(sent.state).toBe("submitted");
        const machine = await stored(dataHash);
        expect(String(machine.context.reviewData.reviewerId)).toBe(REVIEWER_ID);
    });

    it("refuses a pick the web would not offer, leaving the task as it was", async () => {
        const dataHash = await written("A escola tem 900 alunos.");
        const res = await callTool(mcp.app, "submit_report_to_review", {
            dataHash,
            reviewerId: CHECKER_ID,
        });
        expect(res.result.isError).toBe(true);
        expect(res.result.content[0].text).toMatch(
            /picked user cannot take this step/
        );
        expect((await stored(dataHash)).value).toEqual({
            assigned: expect.any(String),
        });
    });
});
