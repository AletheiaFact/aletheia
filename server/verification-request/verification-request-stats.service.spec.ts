import { Model } from "mongoose";
import { getModelToken } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { VerificationRequestService } from "./verification-request.service";
import { VerificationRequestStatsService } from "./verification-request-stats.service";
import { VerificationRequestDocument } from "./schemas/verification-request.schema";
import { createFakeVerificationRequest, mockQuery, mockVerificationRequestModel } from "../mocks/VerificationRequestMock";

describe("VerificationRequestStatsService (Unit)", () => {
  let testingModule: TestingModule;
  let service: VerificationRequestStatsService;
  let model: Model<VerificationRequestDocument>;

  beforeAll(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        VerificationRequestStatsService,
        {
          provide: getModelToken("VerificationRequest"),
          useValue: mockVerificationRequestModel,
        },
        {
          provide: "REQUEST",
          useValue: { user: { id: "test-user" } },
        },
        { provide: VerificationRequestService, useValue: {} },
      ],
    }).compile();

    model = testingModule.get<Model<VerificationRequestDocument>>(
      getModelToken("VerificationRequest")
    );
  });

  beforeEach(async () => {
    service = await testingModule.resolve<VerificationRequestStatsService>(
      VerificationRequestStatsService
    );

    jest.clearAllMocks();
  });

  describe("getStatsRecentActivity", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    const setupMockData = (data: any[]) =>
      mockQuery.exec.mockResolvedValue(data);

    describe("Success scenarios", () => {
      it("should query the database with the correct fields and apply a limit of 10", async () => {
        setupMockData([]);
        await (service as any).getStatsRecentActivity();

        expect(model.find).toHaveBeenCalledWith({});
        expect(mockQuery.limit).toHaveBeenCalledWith(10);
        expect(mockQuery.select).toHaveBeenCalledWith(
          expect.stringContaining("data_hash")
        );
      });

      it("should transform data_hash to the first 8 characters and map _id to id", async () => {
        const mockDoc = createFakeVerificationRequest({
          data_hash: "1234567890ABC",
        });
        setupMockData([mockDoc]);

        const [result] = await (service as any).getStatsRecentActivity();

        expect(result.data_hash).toBe("12345678");
        expect(result.id).toBe(mockDoc._id);
      });
    });

    it("should return an empty array when no activity is found", async () => {
      setupMockData([]);
      const result = await (service as any).getStatsRecentActivity();
      expect(result).toEqual([]);
    });

    it("should propagate an error if the database query fails", async () => {
      const mockError = new Error("DB Error");
      mockQuery.exec.mockRejectedValue(mockError);
      await expect((service as any).getStatsRecentActivity()).rejects.toThrow(
        mockError
      );
    });
  });

  describe("getStatsCount", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should aggregate statuses correctly and calculate totals using $facet structure", async () => {
      const firstDay = new Date("2025-11-01");

      const MOCK_AGGREGATE_RESULT = [
        {
          statuses: [
            { _id: "Posted", count: 10 },
            { _id: "In Triage", count: 5 },
            { _id: "Pre Triage", count: 3 },
            { _id: "Declined", count: 2 },
          ],
          totalThisMonth: [{ count: 12 }],
          totalCount: [{ count: 20 }],
        },
      ];

      mockVerificationRequestModel.aggregate.mockResolvedValue(
        MOCK_AGGREGATE_RESULT
      );

      const result = await (service as any).getStatsCount(firstDay);

      expect(result.total).toBe(20);
      expect(result.totalThisMonth).toBe(12);
      expect(result.verified).toBe(10);
      expect(result.inAnalysis).toBe(5);

      expect(result.pending).toBe(5);
    });

    it("should return zeros when the database returns no data", async () => {
      const EMPTY_FACET_RESULT = [
        {
          statuses: [],
          totalThisMonth: [],
          totalCount: [],
        },
      ];

      mockVerificationRequestModel.aggregate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(EMPTY_FACET_RESULT),
      });

      const result = await (service as any).getStatsCount(new Date());

      expect(result.total).toBe(0);
      expect(result.pending).toBe(0);
      expect(result.totalThisMonth).toBe(0);
    });

    it("should handle missing status fields gracefully", async () => {
      const MALFORMED_RESULT = [
        { statuses: null, totalThisMonth: [], totalCount: [] },
      ];
      mockVerificationRequestModel.aggregate.mockResolvedValue(
        MALFORMED_RESULT
      );

      const result = await service["getStatsCount"](new Date());
      expect(result.verified).toBe(0);
    });
  });

  describe("getStatsSourceChannels", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should calculate percentages correctly based on provided totalCount", async () => {
      const MOCK_AGGREGATE = [
        { _id: "Whatsapp", count: 50 },
        { _id: "Web", count: 50 },
      ];
      const totalCount = 100;

      mockVerificationRequestModel.aggregate.mockResolvedValue(MOCK_AGGREGATE);

      const result = await (service as any).getStatsSourceChannels(totalCount);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        label: "Whatsapp",
        value: 50,
        percentage: 50,
      });
    });

    it("should return 0 percent when totalCount is zero to avoid division by zero", async () => {
      const MOCK_AGGREGATE = [{ _id: "Whatsapp", count: 10 }];

      mockVerificationRequestModel.aggregate.mockResolvedValue(MOCK_AGGREGATE);

      const result = await (service as any).getStatsSourceChannels(0);

      expect(result[0].percentage).toBe(0);
    });

    it("should use 'Unknown' label if _id is missing from aggregation result", async () => {
      const MOCK_AGGREGATE = [{ _id: null, count: 5 }];

      mockVerificationRequestModel.aggregate.mockResolvedValue(MOCK_AGGREGATE);

      const result = await (service as any).getStatsSourceChannels(10);

      expect(result[0].label).toBe("Unknown");
      expect(result[0].percentage).toBe(50);
    });
  });

  describe("getStats", () => {
    it("should orchestrate the calls to private stat methods and return a combined object", async () => {
      const mockCount = {
        total: 100,
        verified: 50,
        inAnalysis: 30,
        pending: 20,
        totalThisMonth: 10,
      };
      const mockChannels = [{ label: "Web", value: 100, percentage: 100 }];
      const mockActivity = [
        { id: "1", status: "Posted", data_hash: "ABC", timestamp: new Date() },
      ];

      const countSpy = jest
        .spyOn(service as any, "getStatsCount")
        .mockResolvedValue(mockCount);
      const channelsSpy = jest
        .spyOn(service as any, "getStatsSourceChannels")
        .mockResolvedValue(mockChannels);
      const activitySpy = jest
        .spyOn(service as any, "getStatsRecentActivity")
        .mockResolvedValue(mockActivity);

      const result = await service.getStats();

      expect(countSpy).toHaveBeenCalled();
      expect(activitySpy).toHaveBeenCalled();

      expect(channelsSpy).toHaveBeenCalledWith(mockCount.total);

      expect(result).toEqual({
        statsCount: mockCount,
        statsSourceChannels: mockChannels,
        statsRecentActivity: mockActivity,
      });

      const calledDate = countSpy.mock.calls[0][0] as Date;
      expect(calledDate.getDate()).toBe(1);
      expect(calledDate.getHours()).toBe(0);
    });
  });
});
