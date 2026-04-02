import { Test, TestingModule } from "@nestjs/testing";
import { NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EventsController } from "./event.controller";
import { EventsService } from "./event.service";
import { ViewService } from "../view/view.service";
import { FeatureFlagService } from "../feature-flag/feature-flag.service";
import { AbilitiesGuard } from "../auth/ability/abilities.guard";
import {
    mockConfigService,
    mockEventsService,
    mockFeatureFlagService,
    mockViewService,
} from "../mocks/EventMock";
import { EventsStatus } from "../types/enums";

describe("EventsController (Unit)", () => {
    let controller: EventsController;

    beforeEach(async () => {
        const testingModule: TestingModule = await Test.createTestingModule({
            controllers: [EventsController],
            providers: [
                { provide: ConfigService, useValue: mockConfigService },
                { provide: EventsService, useValue: mockEventsService },
                { provide: ViewService, useValue: mockViewService },
                { provide: FeatureFlagService, useValue: mockFeatureFlagService },
            ],
        })
            .overrideGuard(AbilitiesGuard)
            .useValue({})
            .compile();

        controller = testingModule.get<EventsController>(EventsController);
    });

    beforeEach(() => {
        jest.clearAllMocks();
        mockFeatureFlagService.isEnableEventsFeature.mockReturnValue(true);
    });

    describe("create", () => {
        it("should throw NotFoundException if feature flag is disabled", async () => {
            mockFeatureFlagService.isEnableEventsFeature.mockReturnValue(false);
            await expect(controller.create({} as any)).rejects.toThrow(NotFoundException);
        });

        it("should delegate creation to eventsService when flag is enabled", async () => {
            const dto = { name: "Event" };
            const created = { _id: "e1", ...dto };
            mockEventsService.create.mockResolvedValue(created);

            const result = await controller.create(dto as any);

            expect(mockEventsService.create).toHaveBeenCalledWith(dto);
            expect(result).toEqual(created);
        });
    });

    describe("update", () => {
        it("should throw NotFoundException if feature flag is disabled", async () => {
            mockFeatureFlagService.isEnableEventsFeature.mockReturnValue(false);
            await expect(controller.update("id", {} as any)).rejects.toThrow(NotFoundException);
        });

        it("should delegate update to eventsService when flag is enabled", async () => {
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
        it("should throw NotFoundException if feature flag is disabled", async () => {
            mockFeatureFlagService.isEnableEventsFeature.mockReturnValue(false);
            await expect(controller.findAll({} as any)).rejects.toThrow(NotFoundException);
        });

        it("should delegate filtering to eventsService when flag is enabled", async () => {
            const query = { page: 0, pageSize: 10, order: "asc", status: EventsStatus.UPCOMING };
            const events = [{ _id: "e1" }];
            mockEventsService.findAll.mockResolvedValue(events);

            const result = await controller.findAll(query as any);

            expect(mockEventsService.findAll).toHaveBeenCalledWith(query);
            expect(result).toEqual(events);
        });
    });

    describe("eventPage", () => {
        it("should redirect to safe namespace when flag is disabled", async () => {
            mockFeatureFlagService.isEnableEventsFeature.mockReturnValue(false);
            const req = { params: { namespace: "tech" } };
            const res = { redirect: jest.fn() };

            await controller.eventPage(req as any, res as any);

            expect(res.redirect).toHaveBeenCalledWith("/tech");
            expect(mockViewService.render).not.toHaveBeenCalled();
        });

        it("should render /event-page when flag is enabled", async () => {
            const req = {
                url: "/event?foo=bar",
                params: { namespace: "main" },
            };
            const res = {};

            await controller.eventPage(req as any, res as any);

            expect(mockViewService.render).toHaveBeenCalledWith(
                req,
                res,
                "/event-page",
                expect.objectContaining({ nameSpace: "main" })
            );
        });
    });

    describe("createEventPage", () => {
        it("should redirect to root when flag is disabled and no namespace", async () => {
            mockFeatureFlagService.isEnableEventsFeature.mockReturnValue(false);
            const req = { params: {} };
            const res = { redirect: jest.fn() };

            await controller.createEventPage(req as any, res as any);

            expect(res.redirect).toHaveBeenCalledWith("/");
        });

        it("should render /event-create when flag is enabled", async () => {
            const req = {
                url: "/event/create",
                params: { namespace: "main" },
            };
            const res = {};

            await controller.createEventPage(req as any, res as any);

            expect(mockViewService.render).toHaveBeenCalledWith(
                req,
                res,
                "/event-create",
                expect.anything()
            );
        });
    });

    describe("eventViewPage", () => {
        it("should redirect when flag is disabled", async () => {
            mockFeatureFlagService.isEnableEventsFeature.mockReturnValue(false);
            const req = { params: { namespace: "test" } };
            const res = { redirect: jest.fn() };

            await controller.eventViewPage(req as any, res as any);

            expect(res.redirect).toHaveBeenCalledWith("/test");
        });

        it("should render page when flag is enabled and event exists", async () => {
            const req = {
                url: "/event/hash-1/slug",
                params: { data_hash: "hash-1", event_slug: "slug", namespace: "main" },
            };
            const res = {};
            const event = { _id: "e1" };
            mockEventsService.findByHash.mockResolvedValue(event);

            await controller.eventViewPage(req as any, res as any);

            expect(mockViewService.render).toHaveBeenCalledWith(
                req,
                res,
                "/event-view-page",
                expect.objectContaining({ event })
            );
        });

        it("should throw NotFoundException when event not found", async () => {
            mockEventsService.findByHash.mockResolvedValue(null);
            const req = { params: { data_hash: "none" }, url: "" };

            await expect(controller.eventViewPage(req as any, {} as any)).rejects.toThrow(
                NotFoundException
            );
        });
    });

    describe("getSafeNamespaceRedirect (Private Logic)", () => {
        it("should return root for malicious namespace input", async () => {
            mockFeatureFlagService.isEnableEventsFeature.mockReturnValue(false);
            const req = { params: { namespace: "google.com" } };
            const res = { redirect: jest.fn() };

            await controller.eventPage(req as any, res as any);

            expect(res.redirect).toHaveBeenCalledWith("/");
        });
    });
});
