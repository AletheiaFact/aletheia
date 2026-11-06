import { authState, callTool } from "./utils/McpTestHelper";
import {
    reviewLog,
    useMcpQueueHelper,
    writerUser,
} from "./utils/McpQueueHelper";

// Issue #2708: a fact-checker (not an admin) who wrote the report of a
// plain sentence moves it on through MCP, as the web lets them.
describe("MCP task queue: the writer sends a reported task on (e2e)", () => {
    const { mcp, reviewTasks, callOk, startWriting } = useMcpQueueHelper();

    const call = async (name: string, args: any) => {
        const body = await callTool(mcp.app, name, args);
        return {
            isError: !!(body.result?.isError || body.error),
            text: body.result?.content?.[0]?.text ?? JSON.stringify(body),
        };
    };
    const stored = async (dataHash: string) =>
        (await reviewTasks().findOne({ data_hash: dataHash }).lean())
            ?.machine;

    const written = async (sentence: string, sendToCrossCheck = false) => {
        const dataHash = await startWriting(sentence);
        authState.user = writerUser();
        await callOk("save_review_log", { dataHash, ...reviewLog });
        await callOk("submit_report", { dataHash, sendToCrossCheck });
        return dataHash;
    };

    it("sends a reported task to cross-checking, and again is a no-op", async () => {
        const dataHash = await written("O índice subiu 3% em 2023.");
        const sent = await callOk("send_to_cross_check", { dataHash });
        expect(sent.state).toBe("selectCrossChecker");
        const again = await callOk("send_to_cross_check", { dataHash });
        expect(again.state).toBe("selectCrossChecker");
        expect((await stored(dataHash)).value).toBe("selectCrossChecker");
    });

    it("explains, without calling it a permission problem, why review needs a cross-check", async () => {
        const dataHash = await written("A cidade tem 2 milhões de habitantes.");
        const res = await call("send_to_review", { dataHash });
        expect(res.isError).toBe(true);
        expect(res.text).toMatch(/not a permission problem/);
        expect(res.text).toMatch(/submit_report_to_review/);
        expect((await stored(dataHash)).value).toBe("reported");
    });

    it("sends to review without a cross-check, also after asking for one", async () => {
        const reported = await written("O desemprego caiu para 7%.");
        expect((await callOk("submit_report_to_review", { dataHash: reported })).state).toBe(
            "selectReviewer"
        );

        const waiting = await written("A obra custou R$ 10 milhões.", true);
        expect((await stored(waiting)).value).toBe("selectCrossChecker");
        const res = await call("send_to_review", { dataHash: waiting });
        expect(res.isError).toBe(true);
        expect(res.text).toMatch(/submit_report_to_review/);
        const moved = await callOk("submit_report_to_review", {
            dataHash: waiting,
        });
        expect(moved.state).toBe("selectReviewer");
        expect((await stored(waiting)).context.reviewData.reviewerId).toBeNull();
    });

    it("moves a task waiting for a reviewer back to cross-checking", async () => {
        const dataHash = await written("A frota tem 500 ônibus.");
        await callOk("submit_report_to_review", { dataHash });
        const sent = await callOk("send_to_cross_check", { dataHash });
        expect(sent.state).toBe("selectCrossChecker");
    });
});
