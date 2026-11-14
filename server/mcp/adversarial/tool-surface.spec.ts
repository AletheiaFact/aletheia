import { connect, factChecker, READ_TOOLS, validArgs } from "./harness";
import type { Session } from "./harness";

describe("MCP adversarial: tool surface", () => {
    let session: Session;
    afterEach(async () => session?.close());

    it("exposes exactly the audited tools (new tools must be added to this suite)", async () => {
        session = await connect(factChecker);
        const { tools } = await session.client.listTools();
        expect(tools.map((t) => t.name).sort()).toEqual(
            [...READ_TOOLS, ...Object.keys(validArgs)].sort()
        );
    });

    it("offers no delete/publish/role/admin tool beyond the audited publish", async () => {
        session = await connect(factChecker);
        const { tools } = await session.client.listTools();
        const forbidden = /delete|remove|publish|role|admin|user|assign/i;
        // publish_review_task is in scope by decision (task queue spec)
        // and covered by queue-transitions.spec.ts. list_assignable_users
        // only reads the web picker's list for the caller's own task, and
        // is covered by pick-next-step-user.spec.ts.
        const audited = ["publish_review_task", "list_assignable_users"];
        expect(
            tools
                .map((t) => t.name)
                .filter((n) => forbidden.test(n) && !audited.includes(n))
        ).toEqual([]);
    });
});
