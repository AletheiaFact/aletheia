import { randomUUID } from "crypto";
import { PostgresBadgeService } from "./postgres/badge.service";
import { getTestDrizzle, resetTestDrizzle } from "../tests/postgres-setup";
import { NotImplementedError } from "../database/errors";

describe.skipIf(process.env.DB_TYPE !== "postgres")(
    "badge postgres-only",
    () => {
        let service: PostgresBadgeService;

        beforeEach(async () => {
            await resetTestDrizzle();
            service = new PostgresBadgeService(await getTestDrizzle());
        });

        it("listAll is a loud 501 until the users and image tables port", async () => {
            await expect(service.listAll()).rejects.toBeInstanceOf(
                NotImplementedError
            );
        });

        it("rejects a non-uuid image id (Mongo throws BSONError on a non-ObjectId)", async () => {
            await expect(
                service.create({
                    name: "x",
                    description: "y",
                    image: { _id: "not-a-uuid" },
                })
            ).rejects.toThrow();
        });

        it("exposes _id, image and the raw imageId on the entity", async () => {
            const imageId = randomUUID();
            const created: any = await service.create({
                name: "x",
                description: "y",
                image: { _id: imageId },
            });
            expect(created._id).toBe(created.id);
            expect(created.image).toBe(imageId);
            expect(created.imageId).toBe(imageId);
            expect(created.isDeleted).toBe(false);
        });
    }
);
