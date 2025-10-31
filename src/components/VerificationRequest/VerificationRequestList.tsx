import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "next-i18next";
import verificationRequestApi from "../../api/verificationRequestApi";
import TopicsApi from "../../api/topicsApi";
import FilterPopover from "./FilterPopover";
import ActiveFilters from "./ActiveFilters";
import { Grid, IconButton, Button } from "@mui/material";
import { FilterList, InfoOutlined } from "@mui/icons-material";
import {
    DataGrid,
    GridActionsCellItem,
    GridColDef,
    GridRowParams,
} from "@mui/x-data-grid";
import colors from "../../styles/colors";
import { useAppSelector } from "../../store/store";
import { useDispatch } from "react-redux";
import { ActionTypes } from "../../store/types";
import debounce from "lodash.debounce";
import AletheiaButton from "../Button";
import InfoTooltip from "../Claim/InfoTooltip";
import DateRangePicker from "../DateRangePicker";

const VerificationRequestList = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [totalVerificationRequests, setTotalVerificationRequests] =
        useState(0);
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 10,
        page: 0,
    });
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [filterValue, setFilterValue] = useState([]);
    const [filterType, setFilterType] = useState("topics");
    const [anchorEl, setAnchorEl] = useState(null);
    const [applyFilters, setApplyFilters] = useState(false);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    const { autoCompleteTopicsResults, filtersUsed, topicFilterUsed } =
        useAppSelector((state) => ({
            autoCompleteTopicsResults:
                state?.search?.autocompleteTopicsResults || [],
            filtersUsed: state?.search?.searchFilterUsed || [],
            topicFilterUsed: state?.topicFilterUsed || [],
        }));

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await verificationRequestApi.get({
                page: paginationModel.page + 1,
                pageSize: paginationModel.pageSize,
                topics: topicFilterUsed,
                filtersUsed: filtersUsed,
                startDate: startDate?.toISOString(),
                endDate: endDate?.toISOString(),
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
        filtersUsed,
        startDate,
        endDate,
    ]);

    useEffect(() => {
        if (isInitialLoad || applyFilters) {
            fetchData();
            if (isInitialLoad) setIsInitialLoad(false);
            setApplyFilters(false);
        }
    }, [applyFilters, fetchData, isInitialLoad]);

    useEffect(() => {
        if (startDate && endDate) {
            fetchData();
        }
    }, [startDate, endDate]);

    const fetchTopicList = async (term) => {
        try {
            await TopicsApi.searchTopics({ query: term, dispatch, t });
        } catch (error) {
            console.error(`Error: ${error.message}`);
        }
    };

    const handleFilterClick = (event) => setAnchorEl(event.currentTarget);
    const handleFilterClose = () => setAnchorEl(null);

    const handleFilterApply = () => {
        setAnchorEl(null);
        if (filterType === "topics" && filterValue) {
            const topicsToAdd = Array.isArray(filterValue)
                ? filterValue
                : [filterValue];
            const updatedTopics = [
                ...new Set([...topicFilterUsed, ...topicsToAdd]),
            ];
            dispatch({
                type: ActionTypes.SET_TOPIC_FILTER_USED,
                topicFilterUsed: updatedTopics,
            });
        }
        if (filterType === "content" && filterValue) {
            dispatch({
                type: ActionTypes.SET_SEARCH_FILTER_USED,
                filterUsed: [...filtersUsed, filterValue],
            });
        }
        setPaginationModel((prev) => ({ ...prev, page: 0 }));
        setApplyFilters(true);
    };

    const handleRemoveFilter = (removedFilter) => {
        if (removedFilter.type === "topic") {
            const updatedTopics = topicFilterUsed.filter(
                (topic) => topic !== removedFilter.value
            );
            dispatch({
                type: ActionTypes.SET_TOPIC_FILTER_USED,
                topicFilterUsed: updatedTopics,
            });
        } else if (removedFilter.type === "content") {
            const updatedFilters = filtersUsed.filter(
                (filter) => filter !== removedFilter.value
            );
            dispatch({
                type: ActionTypes.SET_SEARCH_FILTER_USED,
                filterUsed: updatedFilters,
            });
        }
        setPaginationModel((prev) => ({ ...prev, page: 0 }));
        setApplyFilters(true);
    };

    const handlePaginationChange = (newModel) => {
        setPaginationModel(newModel);
        setApplyFilters(true);
    };

    const handleResetFilters = () => {
        setFilterValue([]);
        setPaginationModel({ pageSize: 10, page: 0 });
        dispatch({
            type: ActionTypes.SET_TOPIC_FILTER_USED,
            topicFilterUsed: [],
        });
        dispatch({ type: ActionTypes.SET_SEARCH_FILTER_USED, filterUsed: [] });
        setStartDate(null);
        setEndDate(null);
        setApplyFilters(true);
    };

    const formatPublicationDate = (dateString) => {
        const publicationDate = new Date(dateString);
        const isValidDate = !isNaN(publicationDate.getTime());

        return isValidDate ? publicationDate.toLocaleDateString() : dateString;
    };

    const columns = React.useMemo<GridColDef[]>(
        () => [
            {
                field: "content",
                headerName: t(
                    "verificationRequest:tagReportedContent"
                ),
                flex: 1,
                valueGetter: (value, row) => row.content,
                renderCell: (params) => (
                    <span>{truncateWithEllipsis(params.value, 50)}</span>
                ),
            },
            {
                field: "reportType",
                headerName: t(
                    "verificationRequest:tagReportType"),
                flex: 1,
                valueGetter: (value, row) => row.reportType || "",
                renderCell: (params) => (
                    <span>{truncateWithEllipsis(t(`claimForm:${params.value}`), 50)}</span>
                ),
            },
            {
                field: "impactArea",
                headerName: t(
                    "verificationRequest:tagImpactArea"
                ),
                flex: 1,
                valueGetter: (value, row) => row.impactArea?.name || "",
                renderCell: (params) => (
                    <span>{truncateWithEllipsis(params.value, 50)}</span>
                ),
            },
            {
                field: "heardFrom",
                headerName: t(
                    "verificationRequest:tagHeardFrom"
                ),
                flex: 1,
                valueGetter: (value, row) => row.heardFrom || "",
                renderCell: (params) => (
                    <span>{truncateWithEllipsis(params.value, 30)}</span>
                ),
            },
            {
                field: "publicationDate",
                headerName: t(
                    "verificationRequest:tagPublicationDate"
                ),
                flex: 1,
                valueGetter: (value, row) =>
                    row.publicationDate
                        ? formatPublicationDate(row.publicationDate)
                        : "",
            },
            {
                field: "source",
                headerName: t("verificationRequest:tagSource"),
                flex: 1,
                valueGetter: (value, row) => row.source || [],
                renderCell: (params) => {
                    const firstSource = params.value[0]?.href;

                    return (
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ overflow: "hidden" }}>
                                {truncateWithEllipsis(firstSource, 30)}
                            </span>
                            {params.value.length > 1 && (
                                <InfoTooltip
                                    placement="top"
                                    content={t("verificationRequest:seeAllSources")}
                                    useCustomStyle={false}
                                >
                                    <InfoOutlined style={{ color: colors.neutralSecondary }} fontSize="inherit" />
                                </InfoTooltip>
                            )}
                        </div>
                    );
                },
            },
            {
                field: "date",
                headerName: t("verificationRequest:tagDate"),
                flex: 1,
                valueGetter: (value, row) =>
                    row.date ? new Date(row.date).toLocaleDateString() : "",
            },
            {
                field: "sourceChannel",
                headerName: t(
                    "verificationRequest:tagSourceChannel"
                ),
                flex: 1,
                valueGetter: (value, row) => row.sourceChannel || "",
            },
            {
                field: "severity",
                headerName: t(
                    "verificationRequest:tagSeverity"
                ),
                flex: 1,
                valueGetter: (value, row) => row.severity || "Alta", // Dynamic Field: It must be populated with the severy of the Verification Request
            },
            {
                field: "viewRequest",
                type: "actions",
                headerName: t(
                    "verificationRequest:verificationRequestViewRequest"
                ),
                width: 150,
                getActions: (params: GridRowParams) => [
                    <GridActionsCellItem
                        key={`viewRequest-${params.row.data_hash}`}
                        icon={
                            <AletheiaButton>
                                {t(
                                    "verificationRequest:openVerificationRequest"
                                )}
                            </AletheiaButton>
                        }
                        onClick={() =>
                            (window.location.href = `/verification-request/${params.row.data_hash}`)
                        }
                        label={t("verificationRequest:openVerificationRequest")}
                    />,
                ],
            },
        ],
        [t]
    );

    const truncateWithEllipsis = useCallback((value, maxLength) => {
        if (!value) return "";
        return value.length > maxLength
            ? `${value.substring(0, maxLength)}...`
            : value;
    }, []);

    const debouncedSetFilterValue = useCallback(
        debounce((value) => setFilterValue(value), 300),
        []
    );

    return (
        <Grid container spacing={2} justifyContent="center">
            <Grid
                item
                xs={10}
                container
                alignItems="center"
                justifyContent="space-between"
                marginTop={2}
            >
                <Grid item>
                    <IconButton onClick={handleFilterClick}>
                        <FilterList />
                    </IconButton>
                    <FilterPopover
                        anchorEl={anchorEl}
                        onClose={handleFilterClose}
                        filterType={filterType}
                        setFilterType={setFilterType}
                        setFilterValue={debouncedSetFilterValue}
                        fetchTopicList={fetchTopicList}
                        autoCompleteTopicsResults={autoCompleteTopicsResults}
                        onFilterApply={handleFilterApply}
                        t={t}
                    />
                </Grid>

                <DateRangePicker
                    startDate={startDate}
                    endDate={endDate}
                    setStartDate={setStartDate}
                    setEndDate={setEndDate}
                />

                {(topicFilterUsed.length > 0 || filtersUsed.length > 0 || (startDate && endDate)) && (
                    <Grid item>
                        <Button onClick={handleResetFilters}>
                            {t("verificationRequest:resetFiltersButton")}
                        </Button>
                    </Grid>
                )}
            </Grid>

            {(topicFilterUsed.length > 0 || filtersUsed.length > 0) && (
                <Grid item xs={10}>
                    <ActiveFilters
                        topicFilterUsed={topicFilterUsed}
                        filtersUsed={filtersUsed}
                        onRemoveFilter={handleRemoveFilter}
                        t={t}
                    />
                </Grid>
            )}

            <Grid item xs={10} sx={{ height: "auto", overflow: "auto" }}>
                <DataGrid
                    rows={filteredRequests}
                    columns={columns}
                    paginationModel={paginationModel}
                    pageSizeOptions={[5, 10, 50]}
                    onPaginationModelChange={handlePaginationChange}
                    getRowId={(row) => row._id}
                    autoHeight
                    rowCount={totalVerificationRequests}
                    paginationMode="server"
                    loading={loading}
                    sx={{
                        "& .MuiDataGrid-columnHeader": {
                            backgroundColor: colors.lightNeutralSecondary,
                            color: colors.primary,
                            fontWeight: "bold",
                            borderBottom: `2px solid ${colors.secondary}`,
                        },
                        "& .MuiIconButton-root": {
                            color:
                                filtersUsed.length > 0 ||
                                    topicFilterUsed.length > 0
                                    ? colors.primary
                                    : "default",
                        },
                    }}
                />
            </Grid>
        </Grid >
    );
};

export default VerificationRequestList;
