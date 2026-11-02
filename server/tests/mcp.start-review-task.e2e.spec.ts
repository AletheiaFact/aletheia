import { randomUUID } from "crypto";
import { AdminUserMock } from "./utils/AdminUserMock";
import {
    authState,
    callTool,
    regularUser,
    useMcpTestHelper,
} from "./utils/McpTestHelper";

// Sentences are the leaves of a claim's content tree: paragraphs also
// carry a data_hash but their `content` is an array, not a string.
const findSentenceHashes = (node: any, found: string[] = []) => {
    if (Array.isArray(node)) {
        node.forEach((child) => findSentenceHashes(child, found));
    } else if (node && typeof node === "object") {
        if (node.data_hash && typeof node.content === "string") {
            found.push(node.data_hash);
        }
        Object.values(node).forEach((child) =>
            findSentenceHashes(child, found)
        );
    }
    return found;
};

describe("MCP start_review_task (e2e)", () => {
    const mcp = useMcpTestHelper();

    // Setup calls must succeed; surface the tool error instead of a
    // confusing JSON.parse failure when they don't.
    const callOk = async (name: string, args: any) => {
        const body = await callTool(mcp.app, name, args);
        const text = body.result?.content?.[0]?.text ?? JSON.stringify(body);
        if (body.result?.isError || body.error) {
            throw new Error(`${name} setup failed: ${text}`);
        }
        return JSON.parse(text);
    };

    const createClaim = async () => {
        const stamp = randomUUID();
        const personality = await callOk("create_personality", {
            name: `Workflow Person ${stamp}`,
            description: "Workflow e2e",
            wikidata: `Q-workflow-${stamp}`,
        });
        const claim = await callOk("create_claim", {
            title: `Workflow claim ${stamp}`,
            content: "Nós criamos o Pronetac.",
            date: new Date().toISOString(),
            sources: [`https://example.org/workflow-${stamp}`],
            personalityId: personality._id,
        });
        const [dataHash] = findSentenceHashes(
            await callOk("get_claim", { claimId: claim._id })
        );
        return { claimId: claim._id as string, dataHash };
    };

    it("creates an assigned fact-checking task for the caller", async () => {
        const { claimId, dataHash } = await createClaim();
        expect(dataHash).toBeDefined();

        const body = await callTool(mcp.app, "start_review_task", {
            claimId,
            dataHash,
        });

        expect(body.result.isError).toBeFalsy();
        const task = JSON.parse(body.result.content[0].text);
        expect(task.data_hash).toBe(dataHash);
        expect(task.target).toBe(claimId);
        expect(task.reviewTaskType).toBe("Claim");
        expect(task.reportModel).toBe("Fact-checking");
        expect(task.machine.value).toEqual({ assigned: "undraft" });
        expect(task.machine.context.reviewData.usersId).toEqual([
            AdminUserMock._id.toString(),
        ]);
    });

    it("refuses a sentence that already has a task", async () => {
        const { claimId, dataHash } = await createClaim();
        await callTool(mcp.app, "start_review_task", { claimId, dataHash });

        const body = await callTool(mcp.app, "start_review_task", {
            claimId,
            dataHash,
        });

        expect(body.result.isError).toBe(true);
        expect(body.result.content[0].text).toMatch(/already/i);
    });

    it("refuses a data_hash that is not a sentence of the claim", async () => {
        const { claimId } = await createClaim();

        const body = await callTool(mcp.app, "start_review_task", {
            claimId,
            dataHash: "0".repeat(32),
        });

        expect(body.result.isError).toBe(true);
        expect(body.result.content[0].text).toMatch(/sentence/i);
    });

    it("blocks a Regular (read-only) user", async () => {
        const { claimId, dataHash } = await createClaim();
        authState.user = regularUser();

        const body = await callTool(mcp.app, "start_review_task", {
            claimId,
            dataHash,
        });

        expect(body.result.isError).toBe(true);
        expect(body.result.content[0].text).toMatch(/not authorized/i);
    });
});
