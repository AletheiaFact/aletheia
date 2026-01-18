import { Types } from "mongoose";
import { BaseRequest } from "../../types/BaseRequest";

interface HistoryParams {
  targetId: string;
  targetModel: string;
}

interface HistoryQuery {
  page?: number;
  pageSize?: number;
  order?: "asc" | "desc";
  type?: string;
}

interface HistoryDetails {
  after: any;
  before?: any;
}

interface M2M {
  isM2M: boolean;
  clientId: string;
  subject: string;
  scopes: string[];
  role: {
    main: string;
  };
  namespace: string;
}

type PerformedBy = M2M | BaseRequest | string;

interface HistoryItem {
  _id?: string;
  targetId: Types.ObjectId;
  targetModel: string;
  user?: PerformedBy;
  type?: string;
  details?: HistoryDetails;
  date?: Date | string;
}

interface HistoryResponse {
  history: HistoryItem[];
  totalChanges: number;
  totalPages: number;
  page: number;
  pageSize: number;
}

export type {
  HistoryParams,
  HistoryQuery,
  HistoryResponse,
  HistoryItem
};
