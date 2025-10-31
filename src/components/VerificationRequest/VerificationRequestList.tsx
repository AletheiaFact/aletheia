import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "next-i18next";
import verificationRequestApi from "../../api/verificationRequestApi";
import TopicsApi from "../../api/topicsApi";
import FilterPopover from "./FilterPopover";
import ActiveFilters from "./ActiveFilters";
import VerificationRequestBoardView from "./VerificationRequestBoardView";
import { Grid, IconButton, Button, ToggleButtonGroup, ToggleButton, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { FilterList, InfoOutlined, ViewList, ViewModule } from "@mui/icons-material";
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
    const [viewMode, setViewMode] = useState<"list" | "board">("list");
    const [priorityFilter, setPriorityFilter] = useState("all");

    const { autoCompleteTopicsResults, topicFilterUsed, impactAreaFilterUsed } =
        useAppSelector((state) => ({
            autoCompleteTopicsResults:
                state?.search?.autocompleteTopicsResults || [],
            topicFilterUsed: state?.topicFilterUsed || [],
            impactAreaFilterUsed: state?.impactAreaFilterUsed || [],
        }));

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await verificationRequestApi.get({
                page: paginationModel.page + 1,
                pageSize: paginationModel.pageSize,
                topics: topicFilterUsed,
                severity: priorityFilter,
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
        if (filterType === "impactArea" && filterValue) {
            const impactAreasToAdd = Array.isArray(filterValue)
                ? filterValue
                : [filterValue];
            const updatedImpactAreas = [
                ...new Set([...impactAreaFilterUsed, ...impactAreasToAdd]),
            ];
            dispatch({
                type: ActionTypes.SET_IMPACT_AREA_FILTER_USED,
                impactAreaFilterUsed: updatedImpactAreas,
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
        } else if (removedFilter.type === "impactArea") {
            const updatedImpactAreas = impactAreaFilterUsed.filter(
                (impactArea) => impactArea !== removedFilter.value
            );
            dispatch({
                type: ActionTypes.SET_IMPACT_AREA_FILTER_USED,
                impactAreaFilterUsed: updatedImpactAreas,
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
        setPriorityFilter("all");
        setPaginationModel({ pageSize: 10, page: 0 });
        dispatch({
            type: ActionTypes.SET_TOPIC_FILTER_USED,
            topicFilterUsed: [],
        });
        dispatch({ type: ActionTypes.SET_IMPACT_AREA_FILTER_USED, impactAreaFilterUsed: [] });
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
                            <span style={{overflow: "hidden"}}>
                                {truncateWithEllipsis(firstSource, 30)}
                            </span>
                            {params.value.length > 1 && (
                                <InfoTooltip
                                    placement="top"
                                    content={t("verificationRequest:seeAllSources")}
                                    useCustomStyle={false}
                                >
                                    <InfoOutlined style={{color: colors.neutralSecondary}} fontSize="inherit" />
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

    const handlePriorityFilterChange = (newPriority: string) => {
        setPriorityFilter(newPriority);
        setPaginationModel((prev) => ({ ...prev, page: 0 }));
        setApplyFilters(true);
    };

    return (
        <Grid container spacing={2} justifyContent="center">
            <Grid
                item
                xs={10}
                container
                alignItems="center"
                justifyContent="space-between"
                style={{ marginTop: 30 }}
            >
                {/* TODO: separate the manage options in a different component
                This will follow the atomic design principles. */}
                <Grid item sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <ToggleButtonGroup
                        value={viewMode}
                        exclusive
                        onChange={(_, newView) => {
                            if (newView !== null) {
                                setViewMode(newView);
                            }
                        }}
                        aria-label="view mode"
                        size="small"
                    >
                        <ToggleButton value="list" aria-label="list view">
                            <ViewList />
                        </ToggleButton>
                        <ToggleButton value="board" aria-label="board view">
                            <ViewModule />
                        </ToggleButton>
                    </ToggleButtonGroup>
                    {viewMode === "board" && (
                        <>
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
                            <FormControl sx={{ minWidth: 200 }} size="small">
                                <InputLabel id="priority-filter-label">
                                    {t("verificationRequest:filterByPriority")}
                                </InputLabel>
                                <Select
                                    labelId="priority-filter-label"
                                    value={priorityFilter}
                                    label={t("verificationRequest:filterByPriority")}
                                    onChange={(e) => handlePriorityFilterChange(e.target.value)}
                                >
                                    <MenuItem value="all">{t("verificationRequest:allPriorities")}</MenuItem>
                                    <MenuItem value="critical">{t("verificationRequest:priorityCritical")}</MenuItem>
                                    <MenuItem value="high">{t("verificationRequest:priorityHigh")}</MenuItem>
                                    <MenuItem value="medium">{t("verificationRequest:priorityMedium")}</MenuItem>
                                    <MenuItem value="low">{t("verificationRequest:priorityLow")}</MenuItem>
                                </Select>
                            </FormControl>
                        </>
                    )}
                </Grid>
                {(topicFilterUsed.length > 0 || priorityFilter !== "all" || impactAreaFilterUsed.length > 0) && (
                    <Grid item>
                        <Button onClick={handleResetFilters}>
                            {t("verificationRequest:resetFiltersButton")}
                        </Button>
                    </Grid>
                )}
            </Grid>
            {(topicFilterUsed.length > 0 || impactAreaFilterUsed.length > 0) && (
                <Grid item xs={10}>
                    <ActiveFilters
                        topicFilterUsed={topicFilterUsed}
                        impactAreaFilterUsed={impactAreaFilterUsed}
                        onRemoveFilter={handleRemoveFilter}
                        t={t}
                    />
                </Grid>
            )}
            {viewMode === "list" ? (
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
                                color: colors.primary
                            },
                        }}
                    />
                </Grid>
            ) : (
                <Grid item xs={12}>
                    <VerificationRequestBoardView
                        requests={filteredRequests}
                        loading={loading}
                        onRequestUpdated={() => fetchData()}
                    />
                </Grid>
            )}
        </Grid>
    );
};

export default VerificationRequestList;
