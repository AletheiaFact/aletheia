import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "next-i18next";
import { useAtom } from "jotai";
import { currentNameSpace } from "../../atoms/namespace";
import verificationRequestApi from "../../api/verificationRequestApi";
import AletheiaButton from "../Button";
import {
    DataGrid,
    GridActionsCellItem,
    GridColDef,
    GridRowParams,
} from "@mui/x-data-grid";
import colors from "../../styles/colors";
import {
    Grid,
    IconButton,
    Popover,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import TopicsApi from "../../api/topicsApi";
import AdvancedSearch from "../Search/AdvancedSearch";
import { useAppSelector } from "../../store/store";
import { useDispatch } from "react-redux";

const VerificationRequestList = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [nameSpace] = useAtom(currentNameSpace);
    const [totalVerificationRequests, setTotalVerificationRequests] =
        useState(0);
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 10,
        page: 0,
    });
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [filterValue, setFilterValue] = useState("");
    const [filterType, setFilterType] = useState("topics");
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);

    const [appliedFilterTopic, setAppliedFilterTopic] = useState(null);
    const [appliedFilterValue, setAppliedFilterValue] = useState("");

    const { autoCompleteTopicsResults, filtersUsed, totalResults } =
        useAppSelector((state) => ({
            autoCompleteTopicsResults:
                state?.search?.autocompleteTopicsResults || [],
            filtersUsed: state?.search?.searchFilterUsed || [],
            totalResults: state?.search?.totalResults || 0,
        }));

    useEffect(() => {
        fetchData();
    }, [paginationModel, nameSpace, appliedFilterTopic, appliedFilterValue]);

    const fetchData = async () => {
        try {
            const response = await verificationRequestApi.get({
                page: paginationModel.page + 1,
                pageSize: paginationModel.pageSize,
                topics: appliedFilterTopic,
            });
            if (response) {
                setTotalVerificationRequests(response.total);
                setFilteredRequests(response.data);
            }
        } catch (error) {
            console.error("Error fetching verification requests:", error);
        }
    };

    const fetchTopicList = async (term) => {
        try {
            await TopicsApi.searchTopics({
                query: term,
                t: t,
                dispatch: dispatch,
            });
        } catch (error) {
            console.log(`Error: ${error.message}`);
        }
    };

    const handleFilterClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleFilterClose = () => {
        setAnchorEl(null);
    };

    const handleFilterApply = () => {
        setAnchorEl(null);
        setAppliedFilterTopic(selectedTopic);
        setAppliedFilterValue(filterValue);
        fetchData();
    };

    const handleTopicChange = (newTopic) => {
        setSelectedTopic(newTopic);
    };

    const columns = React.useMemo<GridColDef[]>(
        () => [
            {
                field: "content",
                headerName: t(
                    "verificationRequest:verificationRequestTagContent"
                ),
                flex: 1,
                valueGetter: (value, row) => row.content,
                renderCell: (params) => (
                    <span>{truncateWithEllipsis(params.value, 50)}</span>
                ),
            },
            {
                field: "heardFrom",
                headerName: t(
                    "verificationRequest:verificationRequestTagHeardFrom"
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
                    "verificationRequest:verificationRequestTagPublicationDate"
                ),
                flex: 1,
                valueGetter: (value, row) =>
                    row.publicationDate
                        ? new Date(row.publicationDate).toLocaleDateString()
                        : "",
            },
            {
                field: "source",
                headerName: t(
                    "verificationRequest:verificationRequestTagSource"
                ),
                flex: 1,
                valueGetter: (value, row) => row.source?.href || "",
                renderCell: (params) => (
                    <span>{truncateWithEllipsis(params.value, 30)}</span>
                ),
            },
            {
                field: "date",
                headerName: t("verificationRequest:verificationRequestTagDate"),
                flex: 1,
                valueGetter: (value, row) =>
                    row.date ? new Date(row.date).toLocaleDateString() : "",
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
        const truncatedValue = value.substring(0, maxLength);
        return value.length > maxLength
            ? `${truncatedValue}...`
            : truncatedValue;
    }, []);

    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;

    return (
        <Grid
            container
            justifyContent="center"
            alignItems="stretch"
            spacing={1}
            my={2}
        >
            <Grid
                item
                xs={10}
                container
                justifyContent="space-between"
                alignItems="center"
            >
                <h2>
                    {t("verificationRequest:verificationRequestListHeader")}
                </h2>
                <IconButton onClick={handleFilterClick}>
                    <FilterListIcon />
                </IconButton>
                <Popover
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleFilterClose}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                >
                    <Grid container spacing={2} padding={2}>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel id="filter-type-label">
                                    Filter By
                                </InputLabel>
                                <Select
                                    labelId="filter-type-label"
                                    value={filterType}
                                    onChange={(e) =>
                                        setFilterType(e.target.value)
                                    }
                                >
                                    <MenuItem value="topics">Topics</MenuItem>
                                    <MenuItem value="content">
                                        Content or Heard From
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        {filterType === "topics" && (
                            <Grid item xs={12}>
                                <AdvancedSearch
                                    defaltValue={filtersUsed}
                                    onSearch={fetchTopicList}
                                    options={autoCompleteTopicsResults}
                                    handleFilter={handleTopicChange}
                                />
                            </Grid>
                        )}

                        {filterType === "content" && (
                            <Grid item xs={12}>
                                <TextField
                                    label="Filter by Content or Heard From"
                                    value={filterValue}
                                    onChange={(e) =>
                                        setFilterValue(e.target.value)
                                    }
                                    fullWidth
                                />
                            </Grid>
                        )}

                        <Grid item xs={12} container justifyContent="flex-end">
                            <Button onClick={handleFilterApply}>Apply</Button>
                        </Grid>
                    </Grid>
                </Popover>
            </Grid>

            <Grid item xs={10} sx={{ height: "auto", overflow: "auto" }}>
                <DataGrid
                    rows={filteredRequests}
                    columns={columns}
                    paginationModel={paginationModel}
                    pageSizeOptions={[5, 10, 50]}
                    onPaginationModelChange={setPaginationModel}
                    getRowId={(row) => row._id}
                    autoHeight
                    rowCount={totalVerificationRequests}
                    paginationMode="server"
                    sx={{
                        "& .MuiDataGrid-columnHeader": {
                            backgroundColor: colors.lightGraySecondary,
                            color: colors.bluePrimary,
                            fontWeight: "bold",
                            borderBottom: `2px solid ${colors.blueSecondary}`,
                        },
                    }}
                />
            </Grid>
        </Grid>
    );
};

export default VerificationRequestList;
