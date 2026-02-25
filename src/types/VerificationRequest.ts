import { Group } from "./Group";
import { Source } from "../../server/source/schemas/source.schema";
import { ActionTypes } from "../store/types";
import { Topic } from "./Topic";
import { UnifiedDefaultValue } from "../components/Form/DynamicInput";

export enum FilterType {
  TOPIC = "topic",
  IMPACT_AREA = "impactArea",
}

interface PaginationSettings {
  pageSize: number;
  page: number;
};
interface TopicOption {
  name: string;
  matchedAlias?: string | null;
}
interface FilterItem {
  label: string;
  value: string;
  type: FilterType;
}

type ViewMode = "board" | "dashboard";

type verificationRequestStatus = "Pre Triage" | "In Triage" | "Posted";

type PaginationModel = Record<verificationRequestStatus, PaginationSettings>;

type SeverityLevel = "low" | "medium" | "high" | "critical";

interface VerificationRequest {
  data_hash: string;
  content: string;
  isSensitive: boolean;
  rejected: boolean;
  group: Group;
  date: Date;
  source?: Source[] | string[];
  _id?: string;
  publicationDate: string;
  heardFrom: string;
  reportType?: string;
  impactArea?: Topic;
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
  autoCompleteTopicsResults?: TopicOption[];
  topicFilterUsed: string[];
  impactAreaFilterUsed: string[];
  applyFilters: boolean;
  viewMode: ViewMode;
  startDate: Date | null;
  endDate: Date | null;
}
interface FiltersActions {
  setIsInitialLoad: (initial: boolean) => void;
  fetchData: (status: verificationRequestStatus) => Promise<void>;
  setPriorityFilter: (value: string) => void;
  setSourceChannelFilter: (value: string) => void;
  setFilterValue: (value: string[]) => void;
  setFilterType: (type: string) => void;
  setAnchorEl: (el: HTMLElement | null) => void;
  setPaginationModel: React.Dispatch<React.SetStateAction<PaginationModel>>;
  setApplyFilters: (apply: boolean) => void;
  fetchTopicList: (term: string) => Promise<void>;
  createFilterChangeHandler: (
    setter: (v: any) => void
  ) => (newValue: any) => void;
  dispatch: (action: { type: ActionTypes; [key: string]: any }) => void;
  t: (key: string) => string;
  setViewMode: (mode: ViewMode) => void;
  setStartDate: (date: Date | null) => void;
  setEndDate: (date: Date | null) => void;
}
interface FiltersContext {
  state: FiltersState;
  actions: FiltersActions;
}
interface StatsCount {
  total?: number;
  totalThisMonth?: number;
  verified: number;
  inAnalysis: number;
  pending: number;
}
interface StatsSourceChannels {
  label: string;
  value: number;
  percentage: number;
}
interface StatsRecentActivity {
  id: string;
  status: string;
  sourceChannel: string;
  data_hash: string;
  timestamp: Date;
}

interface StatsSourceChannelsProps {
  statsCounts?: StatsCount;
  statsSourceChannels: StatsSourceChannels[];
}
interface StatsRecentActivityProps {
  statsRecentActivity: StatsRecentActivity[];
}
interface IEditVerificationRequestDrawer {
    open: boolean;
    onClose: () => void;
    verificationRequest: VerificationRequest;
    onSave: (updatedRequest: VerificationRequest) => void;
}
interface IInputExtraSourcesList {
  defaultSources: UnifiedDefaultValue;
  onChange: (value: string[]) => void;
  disabled: boolean;
  placeholder: string;
  dataCy?: string;
}
interface IReportTypeSelect {
  onChange: (value: UnifiedDefaultValue) => void;
  defaultValue: UnifiedDefaultValue;
  placeholder: string;
  style?: React.CSSProperties;
  isDisabled: boolean;
  dataCy?: string;
}

interface IDynamicVerificationRequestForm {
    data?: VerificationRequest;
    onSubmit: (value: VerificationRequest) => void;
    isLoading: boolean;
    setRecaptchaString: React.Dispatch<React.SetStateAction<string>>;
    hasCaptcha: boolean;
    isEdit: boolean;
    isDrawerOpen: boolean;
    onClose: () => void;
}

export type {
  VerificationRequest,
  FiltersState,
  FiltersActions,
  FiltersContext,
  PaginationModel,
  SeverityLevel,
  ViewMode,
  FilterItem,
  TopicOption,
  StatsCount,
  StatsSourceChannels,
  StatsRecentActivity,
  StatsSourceChannelsProps,
  StatsRecentActivityProps,
  IEditVerificationRequestDrawer,
  IInputExtraSourcesList,
  IReportTypeSelect,
  IDynamicVerificationRequestForm
};
