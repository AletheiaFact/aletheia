import { connect, happyPath, regular, USER_ID, validArgs } from "./harness";
import type { Session } from "./harness";

describe("MCP adversarial: privilege escalation from a read-only role", () => {
    let session: Session;
    afterEach(async () => session?.close());

    it.each(Object.keys(validArgs))(
        "regular user cannot call %s",
        async (tool) => {
            session = await connect(regular);
            // the stored task exists, so a denial is about the role
            session.mocks.reviewTaskService.getReviewTaskByDataHash.mockResolvedValue(
                happyPath[tool]?.task ?? null
            );
            const res = await session.call(tool, validArgs[tool]);
            expect(res.isError).toBe(true);
            // no data service may be touched on a denied write
            const m = session.mocks;
            expect(
                m.reviewTaskService.transitionAtomically
            ).not.toHaveBeenCalled();
            expect(m.reviewTaskService.publishSubmitted).not.toHaveBeenCalled();
            expect(
                m.reviewTaskService.enqueueUnassigned
            ).not.toHaveBeenCalled();
            expect(m.claimService.create).not.toHaveBeenCalled();
            expect(m.personalityService.create).not.toHaveBeenCalled();
            expect(m.sourceService.create).not.toHaveBeenCalled();
            expect(m.reviewTaskService.createAssigned).not.toHaveBeenCalled();
            expect(m.reviewTaskService.addComment).not.toHaveBeenCalled();
            expect(
                m.verificationRequestStateMachineService.request
            ).not.toHaveBeenCalled();
        }
    );

    it("cannot self-promote by passing role/isM2M/user args", async () => {
        session = await connect(regular);
        const res = await session.call("start_review_task", {
            ...validArgs.start_review_task,
            role: { main: "admin" },
            isM2M: true,
            user: { _id: USER_ID, role: { main: "admin" } },
        });
        expect(res.isError).toBe(true);
        expect(
            session.mocks.reviewTaskService.createAssigned
        ).not.toHaveBeenCalled();
    });
});
