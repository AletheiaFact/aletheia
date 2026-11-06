import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose, { Connection, Model, Types } from "mongoose";
import { connect, factChecker, OTHER_USER_ID, USER_ID } from "./harness";
import type { Session } from "./harness";
import { ReviewTaskService } from "../../review-task/review-task.service";

/**
 * Regression for issue #2707: `list_review_tasks` with `mine: "assigned"` and
 * no `value` returned an empty list. The tool defaulted `value` to "", which
 * became the Mongo path "machine.value." and matched nothing. The other
 * adversarial specs mock `listAll`, so this one runs the real match the
 * service builds against a real MongoDB.
 */
describe("MCP adversarial: list_review_tasks mine without a state", () => {
    let session: Session;
    afterEach(async () => session?.close());

    it("does not invent a state filter when value is omitted", async () => {
        session = await connect(factChecker);
        const res = await session.call("list_review_tasks", {
            reviewTaskType: "Claim",
            mine: "assigned",
        });
        expect(res.isError).toBeFalsy();
        const [query] =
            session.mocks.reviewTaskService.listAll.mock.calls[0];
        expect(query.value ?? "").toBe("");
        expect(query.filterUser).toEqual({
            assigned: true,
            crossChecked: false,
            reviewed: false,
        });
    });

    it("tells the agent where the caller's assigned tasks are", async () => {
        session = await connect(factChecker);
        const { tools } = await session.client.listTools();
        const byName = Object.fromEntries(tools.map((t) => [t.name, t]));
        expect(byName.list_review_tasks.description).toMatch(
            /mine: "assigned"/
        );
        expect(byName.list_my_review_tasks.description).toMatch(
            /list_review_tasks with mine: "assigned"/
        );
        expect(
            (byName.list_review_tasks.inputSchema as any).required ?? []
        ).not.toContain("value");
    });

    describe("against MongoDB", () => {
        let server: MongoMemoryServer;
        let connection: Connection;
        let tasks: Model<any>;
        const me = new Types.ObjectId(USER_ID);
        const other = new Types.ObjectId(OTHER_USER_ID);

        const task = (value: unknown, usersId: Types.ObjectId[]) => ({
            data_hash: new Types.ObjectId().toHexString(),
            nameSpace: "main",
            reviewTaskType: "Claim",
            machine: { value, context: { reviewData: { usersId } } },
        });

        // getQueryObject only reads the request user and its field map.
        const service: ReviewTaskService = new (ReviewTaskService as any)({
            user: { _id: USER_ID },
        });
        const mine = { assigned: true, crossChecked: false, reviewed: false };

        beforeAll(async () => {
            server = await MongoMemoryServer.create();
            connection = await mongoose
                .createConnection(server.getUri("list-mine-tasks"))
                .asPromise();
            tasks = connection.model(
                "ReviewTaskListMine",
                new mongoose.Schema({}, { strict: false })
            );
            await tasks.insertMany([
                task({ assigned: "undraft" }, [me]),
                task("reported", [me]),
                task("cross-checking", [me]),
                task("submitted", [me]),
                task({ assigned: "undraft" }, [other]),
            ]);
        });

        afterAll(async () => {
            await connection?.close();
            await server?.stop();
        });

        it.each([undefined, ""])(
            "value %j returns every task assigned to the caller",
            async (value) => {
                const match = service.getQueryObject(value, mine);
                expect(await tasks.countDocuments(match)).toBe(4);
            }
        );

        it.each([
            ["assigned", 1],
            ["reported", 1],
            ["cross-checking", 1],
            ["submitted", 1],
        ])("value %s still narrows to that state", async (value, count) => {
            const match = service.getQueryObject(value, mine);
            expect(await tasks.countDocuments(match)).toBe(count);
        });
    });
});
