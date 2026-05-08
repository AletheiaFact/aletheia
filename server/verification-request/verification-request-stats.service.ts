import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable, Logger, Scope } from "@nestjs/common";
import {
  StatsCount,
  StatsRecentActivity,
  StatsSourceChannels,
} from "./dto/stats-verification-request-dto";
import { VerificationRequestStatus } from "./dto/types";
import { VerificationRequest, VerificationRequestDocument } from "./schemas/verification-request.schema";
import { toError } from "../util/error-handling";

@Injectable({ scope: Scope.REQUEST })
export class VerificationRequestStatsService {
  private readonly logger = new Logger(VerificationRequestStatsService.name);

  constructor(
    @InjectModel(VerificationRequest.name)
    private readonly VerificationRequestModel: Model<VerificationRequestDocument>
  ) {}

  /**
   * Get statistics for verification requests dashboard
   * @returns Statistics object with counts, percentages, and distributions
   */
  async getStats() {
    try {
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const statsCount = await this.getStatsCount(firstDayOfMonth);
      const statsSourceChannels = await this.getStatsSourceChannels(
        statsCount.total
      );
      const statsRecentActivity = await this.getStatsRecentActivity();

      return {
        statsCount,
        statsSourceChannels,
        statsRecentActivity,
      };
    } catch (error) {
      const err = toError(error);
      this.logger.error(
        `Failed to get dashboard stats: ${err.message}`,
        err.stack
      );

      return {
        statsCount: { total: 0, totalThisMonth: 0, verified: 0, inAnalysis: 0, pending: 0 },
        statsSourceChannels: [],
        statsRecentActivity: [],
      };
    }
  }

  /**
   * Get total counts by status
   */
  private async getStatsCount(firstDayOfMonth: Date): Promise<StatsCount> {
    const result = await this.VerificationRequestModel.aggregate([
      {
        $facet: {
          statuses: [
            {
              $group: {
                _id: "$status",
                count: { $sum: 1 },
              },
            },
          ],
          totalThisMonth: [
            { $match: { date: { $gte: firstDayOfMonth } } },
            { $count: "count" },
          ],
          totalCount: [{ $count: "count" }],
        },
      },
    ]);

    const data = result[0] || {
      statuses: [],
      totalThisMonth: [],
      totalCount: [],
    };

    const total = data.totalCount[0]?.count || 0;
    const totalThisMonth = data.totalThisMonth[0]?.count || 0;

    const statusMap = Object.fromEntries(
      (data.statuses || []).map((item) => [item._id, item.count])
    );

    return {
      total,
      verified: statusMap[VerificationRequestStatus.POSTED] || 0,
      inAnalysis: statusMap[VerificationRequestStatus.IN_TRIAGE] || 0,
      pending:
        (statusMap[VerificationRequestStatus.PRE_TRIAGE] || 0) +
        (statusMap[VerificationRequestStatus.DECLINED] || 0),
      totalThisMonth,
    };
  }

  /**
   * Get source channel distribution
   */
  private async getStatsSourceChannels(
    totalCount?: number
  ): Promise<StatsSourceChannels[]> {
    const sourceChannelAggregation =
      await this.VerificationRequestModel.aggregate([
        {
          $group: {
            _id: "$sourceChannel",
            count: { $sum: 1 },
          },
        },
        {
          $sort: { count: -1 },
        },
      ]);

    return sourceChannelAggregation.map((item) => ({
      label: item._id || "Unknown",
      value: item.count,
      percentage: (totalCount ?? 0) > 0 ? (item.count / (totalCount ?? 1)) * 100 : 0,
    }));
  }

  /**
   * Get recent activity (last 10 updates)
   */
  private async getStatsRecentActivity(): Promise<StatsRecentActivity[]> {
    const recentRequests = await this.VerificationRequestModel.find({})
      .sort({ updatedAt: -1 })
      .limit(10)
      .select("_id status sourceChannel content data_hash updatedAt")
      .lean()
      .exec();

    return recentRequests.map((req) => ({
      id: req._id.toString(),
      status: req.status,
      sourceChannel: req.sourceChannel,
      data_hash: req.data_hash.substring(0, 8),
      timestamp: req.updatedAt,
    }));
  }
}
