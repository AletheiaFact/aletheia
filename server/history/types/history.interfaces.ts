import { Roles } from "auth/ability/ability.factory";
import { HistoryType, TargetModel } from "history/schema/history.schema";
import { Types } from "mongoose";

export const HEX24 = /^[0-9a-fA-F]{24}$/;

interface HistoryParams {
  targetId: string;
  targetModel: TargetModel;
}

interface HistoryQuery {
  page?: number;
  pageSize?: number;
  order?: "asc" | "desc";
  type?: HistoryType;
}
interface HistoryResponse {
  history: HistoryItem[];
  totalChanges: number;
  totalPages: number;
  page: number;
  pageSize: number;
}
interface HistoryItem {
  _id?: string;
  targetId: Types.ObjectId;
  targetModel: TargetModel;
  user?: PerformedBy;
  type?: HistoryType;
  details?: HistoryDetails;
  date?: Date | string;
}

type PerformedBy = Types.ObjectId[] | M2M | string | null;
interface M2M {
  isM2M: boolean;
  clientId: string;
  subject: string;
  scopes: string[];
  role: {
    main: Roles.Integration;
  };
  namespace: string;
}
interface HistoryDetails {
  after: AfterAndBeforeType;
  before?: AfterAndBeforeType | null;
}
type AfterAndBeforeType = Record<string, any>;
interface IHideableContent {
    _id?: string;
    isHidden?: boolean;
    [key: string]: any;
}

export type {
  HistoryParams,
  HistoryQuery,
  HistoryResponse,
  HistoryItem,
  PerformedBy,
  AfterAndBeforeType,
  IHideableContent
};
