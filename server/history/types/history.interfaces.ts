import { User } from "../../users/schemas/user.schema";

interface HistoryParams {
	targetId: string;
	targetModel: string;
}

interface HistoryQuery {
	page?: string | number;
	pageSize?: string | number;
	order?: "asc" | "desc" | string;
	type?: string | string[];
}

interface HistoryDetails {
	after?: any;
	before?: any;
}

interface HistoryItem {
 	_id?: string;
 	targetId?: string;
 	targetModel?: string;
 	user?: User | any; // to do type for another user type
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
};
