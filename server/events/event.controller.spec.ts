import { Test, TestingModule } from "@nestjs/testing";
import { NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EventsController } from "./event.controller";
import { EventsService } from "./event.service";
import { ViewService } from "../view/view.service";
import { AbilitiesGuard } from "../auth/ability/abilities.guard";
import {
    mockConfigService,
    mockEventsService,
    mockViewService,
} from "../mocks/EventMock";

describe("EventsController (Unit)", () => {
    let controller: EventsController;

    beforeEach(async () => {
        const testingModule: TestingModule = await Test.createTestingModule({
            controllers: [EventsController],
            providers: [
                { provide: ConfigService, useValue: mockConfigService },
                { provide: EventsService, useValue: mockEventsService },
                { provide: ViewService, useValue: mockViewService },
            ],
        })
            .overrideGuard(AbilitiesGuard)
            .useValue({})
            .compile();

        controller = testingModule.get<EventsController>(EventsController);
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("create", () => {
        it("should delegate creation to eventsService", async () => {
            const dto = { name: "Event" };
            const created = { _id: "e1", ...dto };
            mockEventsService.create.mockResolvedValue(created);

            const result = await controller.create(dto as any);

            expect(mockEventsService.create).toHaveBeenCalledWith(dto);
            expect(result).toEqual(created);
        });
    });

    describe("update", () => {
        it("should delegate update to eventsService", async () => {
            const id = "507f1f77bcf86cd799439011";
            const dto = { name: "Updated" };
            const updated = { _id: id, ...dto };
            mockEventsService.update.mockResolvedValue(updated);

            const result = await controller.update(id, dto as any);

            expect(mockEventsService.update).toHaveBeenCalledWith(id, dto);
            expect(result).toEqual(updated);
        });
    });

    describe("findAll", () => {
        it("should delegate filtering to eventsService", async () => {
            const query = { page: 0, pageSize: 10, order: "asc", status: "upcoming" };
            const events = [{ _id: "e1" }];
            mockEventsService.findAll.mockResolvedValue(events);

            const result = await controller.findAll(query as any);

            expect(mockEventsService.findAll).toHaveBeenCalledWith(query);
            expect(result).toEqual(events);
        });
    });

    describe("eventPage", () => {
        it("should render /event-page with parsed query, namespace and site key", async () => {
            const req = {
                url: "/event?foo=bar",
                params: { namespace: "main" },
            };
            const res = {};

            await controller.eventPage(req as any, res as any);

            expect(mockConfigService.get).toHaveBeenCalledWith("recaptcha_sitekey");
            expect(mockViewService.render).toHaveBeenCalledWith(
                req,
                res,
                "/event-page",
                expect.objectContaining({
                    foo: "bar",
                    nameSpace: "main",
                    sitekey: "test-site-key",
                })
            );
        });
    });

    describe("createEventPage", () => {
        it("should render /event-create with parsed query, namespace and site key", async () => {
            const req = {
                url: "/event/create?foo=bar",
                params: { namespace: "main" },
            };
            const res = {};

            await controller.createEventPage(req as any, res as any);

            expect(mockConfigService.get).toHaveBeenCalledWith("recaptcha_sitekey");
            expect(mockViewService.render).toHaveBeenCalledWith(
                req,
                res,
                "/event-create",
                expect.objectContaining({
                    foo: "bar",
                    nameSpace: "main",
                    sitekey: "test-site-key",
                })
            );
        });
    });

    describe("eventViewPage", () => {
        it("should render /event-view-page when event exists", async () => {
            const req = {
                url: "/event/hash-1?lang=en",
                params: { namespace: "main", data_hash: "hash-1" },
            };
            const res = {};
            const fullEvent = { _id: "e1", data_hash: "hash-1" };

            mockEventsService.getFullEventByHash.mockResolvedValue(fullEvent);

            await controller.eventViewPage(req as any, res as any);

            expect(mockEventsService.getFullEventByHash).toHaveBeenCalledWith("hash-1");
            expect(mockConfigService.get).toHaveBeenCalledWith("recaptcha_sitekey");
            expect(mockViewService.render).toHaveBeenCalledWith(
                req,
                res,
                "/event-view-page",
                expect.objectContaining({
                    lang: "en",
                    fullEvent,
                    namespace: "main",
                    sitekey: "test-site-key",
                })
            );
        });

        it("should throw NotFoundException when service returns empty event", async () => {
            const req = {
                url: "/event/hash-1",
                params: { namespace: "main", data_hash: "hash-1" },
            };
            const res = {};

            mockEventsService.getFullEventByHash.mockResolvedValue(null);

            await expect(controller.eventViewPage(req as any, res as any)).rejects.toThrow(
                NotFoundException
            );
            expect(mockViewService.render).not.toHaveBeenCalled();
        });

        it("should rethrow service errors and log only non-NotFound errors", async () => {
            const req = {
                url: "/event/hash-1",
                params: { namespace: "main", data_hash: "hash-1" },
            };
            const res = {};
            const error = new Error("unexpected");
            const loggerErrorSpy = jest.spyOn((controller as any).logger, "error");

            mockEventsService.getFullEventByHash.mockRejectedValue(error);

            await expect(controller.eventViewPage(req as any, res as any)).rejects.toThrow(
                "unexpected"
            );
            expect(loggerErrorSpy).toHaveBeenCalled();
        });
    });
});
