export interface GetVerificationRequestsParams {
    targetId: string;
    targetModel: string;
    page: number;
    pageSize: number;
    order: "asc" | "desc";
    type?: string | string[];
}