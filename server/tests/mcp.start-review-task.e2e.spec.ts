import { randomUUID } from "crypto";
import { AdminUserMock } from "./utils/AdminUserMock";
import { FeatureFlagService } from "../feature-flag/feature-flag.service";
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

    afterEach(() => vi.restoreAllMocks());

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
            // Unique per claim: the sentence data_hash depends on its text,
            // and each test needs a sentence with no review task yet
            content: `Nós criamos o Pronetac ${stamp}.`,
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
        expect(task.machine.value).toBe("assigned");
        expect(task.machine.context.reviewData.usersId).toEqual([
            AdminUserMock._id.toString(),
        ]);
    });

    it("refuses a sentence that already has a task", async () => {
        const { claimId, dataHash } = await createClaim();
        const first = await callOk("start_review_task", { claimId, dataHash });
        // ReviewTaskService.create saves without awaiting: wait until stored
        await vi.waitFor(async () => {
            const read = await callTool(mcp.app, "get_review_task", {
                reviewTaskId: first._id,
            });
            expect(JSON.parse(read.result.content[0].text)).not.toBeNull();
        });

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

    it("defaults a new task to the aletheia methodology", async () => {
        const { claimId, dataHash } = await createClaim();
        const body = await callTool(mcp.app, "start_review_task", {
            claimId,
            dataHash,
        });
        const task = JSON.parse(body.result.content[0].text);
        expect(task.classificationMethodology).toBe("aletheia");
    });

    it("stores rncd-debate when the methodology flag is on", async () => {
        // Prototype, not app.get(): modules that list FeatureFlagService in
        // their own providers get separate instances
        vi.spyOn(
            FeatureFlagService.prototype,
            "isEnableClassificationMethodology"
        ).mockReturnValue(true);
        const { claimId, dataHash } = await createClaim();

        const body = await callTool(mcp.app, "start_review_task", {
            claimId,
            dataHash,
            classificationMethodology: "rncd-debate",
        });

        expect(body.result.isError).toBeFalsy();
        const task = JSON.parse(body.result.content[0].text);
        expect(task.classificationMethodology).toBe("rncd-debate");

        // ReviewTaskService.create saves without awaiting: poll the read
        await vi.waitFor(async () => {
            const read = await callTool(mcp.app, "get_review_task", {
                reviewTaskId: task._id,
            });
            expect(
                JSON.parse(read.result.content[0].text)
                    ?.classificationMethodology
            ).toBe("rncd-debate");
        });
    });

    it("refuses rncd-debate while the methodology flag is off", async () => {
        const { claimId, dataHash } = await createClaim();
        const body = await callTool(mcp.app, "start_review_task", {
            claimId,
            dataHash,
            classificationMethodology: "rncd-debate",
        });
        expect(body.result.isError).toBe(true);
        expect(body.result.content[0].text).toMatch(/disabled/i);
    });

    it("rejects an unknown methodology", async () => {
        const { claimId, dataHash } = await createClaim();
        const body = await callTool(mcp.app, "start_review_task", {
            claimId,
            dataHash,
            classificationMethodology: "nope",
        });
        expect(body.result?.isError || body.error).toBeTruthy();
    });

    it("lists the classification methodologies", async () => {
        const body = await callTool(
            mcp.app,
            "list_classification_methodologies",
            {}
        );
        const list = JSON.parse(body.result.content[0].text);
        expect(list.map((m: any) => m.id)).toEqual(["aletheia", "rncd-debate"]);
        expect(
            list
                .find((m: any) => m.id === "rncd-debate")
                .options.map((o: any) => o.label.pt)
        ).toEqual(["Falso", "Enganosa", "Verdadeiro"]);
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
