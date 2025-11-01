import { Group } from "./Group";
import { Source } from "../../server/source/schemas/source.schema";
import { Dispatch } from "react";

type ViewMode = "list" | "board";

type PaginationModel = {
  pageSize: number;
  page: number;
};

type SeverityLevel = "low" | "medium" | "high" | "critical";

type VerificationRequest = {
  data_hash: string;
  content: string;
  isSensitive: boolean;
  rejected: boolean;
  group: Group;
  date: Date;
  source?: Source[];
  _id?: string;
  publicationDate: string;
  heardFrom: string;
};
interface VerificationRequestBoardViewProps {
  requests: any[];
  loading: boolean;
}
interface FiltersState {
  loading: boolean;
  filteredRequests: VerificationRequest[];
  totalVerificationRequests: number;
  isInitialLoad: boolean;
  viewMode: ViewMode;
  priorityFilter: string;
  sourceChannelFilter: string;
  filterValue: string[];
  filterType: string;
  anchorEl: HTMLElement | null;
  paginationModel: {
    pageSize: number;
    page: number;
  };
  autoCompleteTopicsResults: string[];
  topicFilterUsed: string[];
  impactAreaFilterUsed: string[];
  applyFilters: boolean;
}
interface FiltersActions {
  setIsInitialLoad: (initial: boolean) => void;
  fetchData: () => Promise<void>;
  setViewMode: (mode: ViewMode) => void;
  setPriorityFilter: (value: string) => void;
  setSourceChannelFilter: (value: string) => void;
  setFilterValue: (value: string[]) => void;
  setFilterType: (type: string) => void;
  setAnchorEl: (el: HTMLElement | null) => void;
  setPaginationModel: (model: FiltersState["paginationModel"]) => void;
  setApplyFilters: (apply: boolean) => void;
  fetchTopicList: (term: string) => Promise<void>;
  createFilterChangeHandler: (
    setter: (v: any) => void
  ) => (newValue: any) => void;
  dispatch: Dispatch<any>;
  t: (key: string) => string;
}
interface FiltersContext {
  state: FiltersState;
  actions: FiltersActions;
}

export type {
  VerificationRequest,
  FiltersState,
  FiltersActions,
  FiltersContext,
  ViewMode,
  PaginationModel,
  VerificationRequestBoardViewProps,
  SeverityLevel,
};
