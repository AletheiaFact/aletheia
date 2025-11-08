import { useState, useCallback, useEffect } from "react";
import { useAppSelector } from "../../store/store";
import { useDispatch } from "react-redux";
import { useTranslation } from "next-i18next";
import TopicsApi from "../../api/topicsApi";
import verificationRequestApi from "../../api/verificationRequestApi";
import debounce from "lodash.debounce";
import { FiltersContext, ViewMode } from "../../types/VerificationRequest";

export const useVerificationRequestFilters = (): FiltersContext => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [viewMode, setViewMode] = useState<ViewMode>("board");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sourceChannelFilter, setSourceChannelFilter] = useState("all");
  const [filterValue, setFilterValue] = useState([]);
  const [filterType, setFilterType] = useState("topics");
  const [anchorEl, setAnchorEl] = useState(null);
  const [paginationModel, setPaginationModel] = useState({
    "Pre Triage": { pageSize: 20, page: 0 },
    "In Triage": { pageSize: 20, page: 0 },
    Posted: { pageSize: 20, page: 0 },
  });

  const [applyFilters, setApplyFilters] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const [totalVerificationRequests, setTotalVerificationRequests] = useState({
    "Pre Triage": 0,
    "In Triage": 0,
    Posted: 0,
  });
  const [filteredRequests, setFilteredRequests] = useState({
    "Pre Triage": [],
    "In Triage": [],
    Posted: [],
  });
  const [loading, setLoading] = useState({
    "Pre Triage": false,
    "In Triage": false,
    Posted: false,
  });

  const { autoCompleteTopicsResults, topicFilterUsed, impactAreaFilterUsed } =
    useAppSelector((state) => ({
      autoCompleteTopicsResults: state?.search?.autocompleteTopicsResults || [],
      topicFilterUsed: state?.topicFilterUsed || [],
      impactAreaFilterUsed: state?.impactAreaFilterUsed || [],
    }));

  const fetchData = useCallback(
    async (status: "Pre Triage" | "In Triage" | "Posted") => {
      setLoading((prev) => ({ ...prev, [status]: true }));
      try {
        const response = await verificationRequestApi.get({
          page: paginationModel[status].page + 1,
          pageSize: paginationModel[status].pageSize,
          topics: topicFilterUsed,
          severity: priorityFilter,
          sourceChannel: sourceChannelFilter,
          impactArea: impactAreaFilterUsed,
          status: status,
        });

        if (response) {
          setTotalVerificationRequests((prev) => ({
            ...prev,
            [status]: response.total,
          }));
          setFilteredRequests((prev) => ({
            ...prev,
            [status]: response.data,
          }));
        }
      } catch (error) {
        console.error("Error fetching verification requests:", error);
      } finally {
        setLoading((prev) => ({ ...prev, [status]: false }));
      }
    }, [
      paginationModel,
      topicFilterUsed,
      priorityFilter,
      sourceChannelFilter,
      impactAreaFilterUsed,
    ]);

  useEffect(() => {
    if (isInitialLoad || applyFilters) {
      fetchData("Pre Triage");
      fetchData("In Triage");
      fetchData("Posted");
      if (isInitialLoad) setIsInitialLoad(false);
      setApplyFilters(false);
    }
  }, [applyFilters, fetchData, isInitialLoad]);

  const fetchTopicList = async (term) => {
    try {
      await TopicsApi.searchTopics({ query: term, dispatch, t });
    } catch (error) {
      console.error(error);
    }
  };

  const debouncedSetFilterValue = useCallback(
    debounce((value) => setFilterValue(value), 300),
    []
  );

  const createFilterChangeHandler = (setter) => (newValue) => {
    setter(newValue);
    setPaginationModel((prev) => ({
      "Pre Triage": { ...prev["Pre Triage"], page: 0 },
      "In Triage": { ...prev["In Triage"], page: 0 },
      Posted: { ...prev.Posted, page: 0 },
    }));
    setApplyFilters(true);
  };

  return {
    state: {
      loading,
      filteredRequests,
      totalVerificationRequests,
      priorityFilter,
      sourceChannelFilter,
      filterValue,
      filterType,
      anchorEl,
      paginationModel,
      autoCompleteTopicsResults,
      topicFilterUsed,
      impactAreaFilterUsed,
      applyFilters,
      isInitialLoad,
      viewMode,
    },
    actions: {
      setPriorityFilter,
      setSourceChannelFilter,
      setFilterValue: debouncedSetFilterValue,
      setFilterType,
      setAnchorEl,
      setPaginationModel,
      setApplyFilters,
      setIsInitialLoad,
      fetchTopicList,
      createFilterChangeHandler,
      fetchData,
      dispatch,
      t,
      setViewMode,
    },
  };
};
