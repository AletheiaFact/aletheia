export interface GetHistoryParams {
    targetId: string;
    targetModel: string;
    page: number;
    pageSize: number;
    order: "asc" | "desc";
    type?: string | string[];
}