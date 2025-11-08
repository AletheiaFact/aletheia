import { Group } from "./Group";
import { Source } from "../../server/source/schemas/source.schema";
import { Dispatch } from "react";

type PaginationSettings = {
  pageSize: number;
  page: number;
};

type ViewMode = "board" | "dashboard" ;

type verificationRequestStatus = "Pre Triage" | "In Triage" | "Posted";

type PaginationModel = Record<verificationRequestStatus, PaginationSettings>;

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
interface FiltersState {
  loading: Record<verificationRequestStatus, boolean>;
  filteredRequests: Record<verificationRequestStatus, VerificationRequest[]>;
  totalVerificationRequests: Record<verificationRequestStatus, number>;
  isInitialLoad: boolean;
  priorityFilter: string;
  sourceChannelFilter: string;
  filterValue: string[];
  filterType: string;
  anchorEl: HTMLElement | null;
  paginationModel: PaginationModel;
  autoCompleteTopicsResults: string[];
  topicFilterUsed: string[];
  impactAreaFilterUsed: string[];
  applyFilters: boolean;
  viewMode: ViewMode;
}
interface FiltersActions {
  setIsInitialLoad: (initial: boolean) => void;
  fetchData: (status: verificationRequestStatus) => Promise<void>;
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
  setViewMode: (mode: ViewMode) => void;
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
  PaginationModel,
  SeverityLevel,
  ViewMode,
};
