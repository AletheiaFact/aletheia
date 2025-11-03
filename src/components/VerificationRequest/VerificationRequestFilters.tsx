import { useState, useCallback, useEffect } from "react";
import { useAppSelector } from "../../store/store";
import { useDispatch } from "react-redux";
import { useTranslation } from "next-i18next";
import TopicsApi from "../../api/topicsApi";
import verificationRequestApi from "../../api/verificationRequestApi";
import debounce from "lodash.debounce";
import {
  FiltersContext,
  VerificationRequest,
  ViewMode,
} from "../../types/VerificationRequest";

export const useVerificationRequestFilters = (): FiltersContext => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sourceChannelFilter, setSourceChannelFilter] = useState("all");
  const [filterValue, setFilterValue] = useState([]);
  const [filterType, setFilterType] = useState("topics");
  const [anchorEl, setAnchorEl] = useState(null);

  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });

  const [applyFilters, setApplyFilters] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const [totalVerificationRequests, setTotalVerificationRequests] = useState(0);
  const [filteredRequests, setFilteredRequests] = useState<
    VerificationRequest[]
  >([]);
  const [loading, setLoading] = useState(false);

  const { autoCompleteTopicsResults, topicFilterUsed, impactAreaFilterUsed } =
    useAppSelector((state) => ({
      autoCompleteTopicsResults: state?.search?.autocompleteTopicsResults || [],
      topicFilterUsed: state?.topicFilterUsed || [],
      impactAreaFilterUsed: state?.impactAreaFilterUsed || [],
    }));

  const fetchData = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await verificationRequestApi.get({
        page: paginationModel.page + 1,
        pageSize: paginationModel.pageSize,
        topics: topicFilterUsed,
        severity: priorityFilter,
        sourceChannel: sourceChannelFilter,
        impactArea: impactAreaFilterUsed,
      });

      if (response) {
        setTotalVerificationRequests(response.total);
        setFilteredRequests(response.data);
      }
    } catch (error) {
      console.error("Error fetching verification requests:", error);
    } finally {
      setLoading(false);
    }
  }, [
    paginationModel.page,
    paginationModel.pageSize,
    topicFilterUsed,
    priorityFilter,
    sourceChannelFilter,
    impactAreaFilterUsed,
  ]);

  useEffect(() => {
    if (isInitialLoad || applyFilters) {
      fetchData();
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
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
    setApplyFilters(true);
  };

  return {
    state: {
      loading,
      filteredRequests,
      totalVerificationRequests,
      viewMode,
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
    },
    actions: {
      setViewMode,
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
    },
  };
};
