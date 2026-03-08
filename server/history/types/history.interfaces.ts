import { M2M } from "../../entities/m2m.entity";
import { HistoryType, TargetModel } from "../schema/history.schema";
import { Types } from "mongoose";

interface HistoryParams {
    targetId: string;
    targetModel: TargetModel;
}

interface HistoryQuery {
    page?: number;
    pageSize?: number;
    order?: "asc" | "desc";
    type?: HistoryType[];
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
    type?: HistoryType | { $in: HistoryType[] };
    details?: HistoryDetails;
    date?: Date | string;
}

type PerformedBy = Types.ObjectId[] | M2M | string | null;
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
