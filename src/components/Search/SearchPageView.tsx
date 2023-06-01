import React from "react";
import SearchApi from "../../api/searchApi";
import { Typography } from "antd";
import Button, { ButtonType } from "../Button";
import { useAppSelector } from "../../store/store";
import { Divider, Grid } from "@mui/material";
import { useDispatch } from "react-redux";
import { ActionTypes, SearchTypes } from "../../store/types";
import { useRouter } from "next/router";
import SearchCard from "./SearchCard";
import SearchWithAutocomplete from "./AutoCompleteList";
import { useTranslation } from "next-i18next";
import PaginationOptions from "./PaginationOptions";
import topicApi from "../../api/topicsApi";
import AdvancedSearch from "./AdvancedSearch";
import SearchIcon from "@mui/icons-material/Search";

function SearchPageView({ searchText }) {
    const dispatch = useDispatch();
    const router = useRouter();
    const { t } = useTranslation();

    const {
        results,
        autoCompleteResults,
        autoCompleteTopicsResults,
        searchName,
        filters,
        filtersUsed,
        totalResults,
    } = useAppSelector((state) => {
        return {
            results: [
                state?.search?.searchResults?.personalities || [],
                state?.search?.searchResults?.claims || [],
                state?.search?.searchResults?.sentences || [],
            ],
            autoCompleteResults: [
                state?.search?.autocompleteResults?.personalities || [],
                state?.search?.autocompleteResults?.claims || [],
                state?.search?.autocompleteResults?.sentences || [],
            ],
            autoCompleteTopicsResults:
                state?.search?.autocompleteTopicsResults || [],
            searchName: state?.search?.searchInput || null,
            filters: state?.search?.searchFilter || [],
            filtersUsed: state?.search?.searchFilterUsed || [],
            totalResults: state?.search?.totalResults || 0,
        };
    });

    const { page, pageSize, totalPages } = useAppSelector((state) => {
        return {
            page: state?.search?.searchCurPage || 1,
            pageSize: state?.search?.searchPageSize || 10,
            totalPages: state?.search?.searchTotalPages || 1,
        };
    });

    const filterAutoCompleteResults = (autoCompleteResults) => {
        const names = autoCompleteResults[0].map((item) => item?.name);
        const titles = autoCompleteResults[1].map((item) => item?.title);
        const contents = autoCompleteResults[2].map((item) => item?.content);

        const result = names.concat(titles, contents);

        return result;
    };

    const enableSearchResults = results?.some((subArr) => subArr.length > 0);

    const handleInputSearch = async (term) => {
        dispatch({
            type: ActionTypes.SET_SEARCH_NAME,
            searchName: term,
        });

        try {
            await SearchApi.getResults(dispatch, {
                type: SearchTypes.AUTOCOMPLETE,
                page: page,
                pageSize: pageSize,
                searchText: term,
            });
        } catch (error) {
            console.log(`Error: ${error.message}`);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        router
            .push({
                pathname: "/search",
                query: {
                    searchText: searchName,
                    pageSize: pageSize,
                    page: 1,
                    filter: filters,
                },
            })
            .catch((error) => console.log(`Error: ${error.message}`));
    };

    const handleFilter = (newValue) => {
        dispatch({
            type: ActionTypes.SET_SEARCH_FILTER,
            filters: newValue,
        });
    };

    const handleOnChange = async (optionClicked) => {
        try {
            await router.push({
                pathname: "/search",
                query: {
                    searchText: optionClicked,
                    pageSize: pageSize,
                    page: 1,
                    filter: filters,
                },
            });
        } catch (error) {
            console.log(`Error: ${error.message}`);
        }
    };

    const fetchTopicList = async (term) => {
        try {
            await topicApi.getTopics({
                topicName: term,
                t: t,
                dispatch: dispatch,
            });
        } catch (error) {
            console.log(`Error: ${error.message}`);
        }
    };

    const handleSearchClick = async ({
        type,
        claimSlug = "",
        personalitySlug = "",
        data_hash = "",
    }) => {
        switch (type) {
            case "personality":
                await router.push(`/personality/${personalitySlug}`);
                break;
            case "claim":
                await router.push(
                    `/personality/${personalitySlug}/claim/${claimSlug}`
                );
                break;
            case "sentence":
                await router.push(
                    `/personality/${personalitySlug}/claim/${claimSlug}/sentence/${data_hash}`
                );
                break;
        }
    };

    const paginationRequired = pageSize < totalResults;

    return (
        <>
            <Grid
                container
                justifyContent="center"
                alignItems="stretch"
                spacing={1}
                my={2}
            >
                <Grid item xs={7}>
                    <Typography.Title level={3}>
                        {t("search:searchPageTittle")}
                    </Typography.Title>
                    <Divider />
                    <form style={{ width: "50%" }} onSubmit={handleSubmit}>
                        <div
                            style={{
                                display: "flex",
                                marginBottom: "10px",
                                marginTop: "10px",
                            }}
                        >
                            <SearchWithAutocomplete
                                value={searchName}
                                options={filterAutoCompleteResults(
                                    autoCompleteResults
                                )}
                                handleOnChange={handleOnChange}
                                onSearch={handleInputSearch}
                                t={t}
                            />
                            <Button type={ButtonType.blue} htmlType="submit">
                                <SearchIcon />
                            </Button>
                        </div>
                        <AdvancedSearch
                            defaltValue={filtersUsed}
                            onSearch={fetchTopicList}
                            options={autoCompleteTopicsResults}
                            handleFilter={handleFilter}
                        />
                    </form>
                    {enableSearchResults && (
                        <>
                            {results.map((result, i) => {
                                const type = [
                                    "personality",
                                    "claim",
                                    "sentence",
                                ][i];
                                const key = type + i;
                                return (
                                    <SearchCard
                                        key={key}
                                        title={t(`search:${type}HeaderTitle`)}
                                        content={result}
                                        searchName={searchName}
                                        handleSearchClick={handleSearchClick}
                                        type={type}
                                        avatar={i !== 0 ? false : true}
                                    />
                                );
                            })}
                            {paginationRequired && (
                                <PaginationOptions
                                    searchText={searchText}
                                    pageSize={pageSize}
                                    totalPages={totalPages}
                                    page={page}
                                    filters={filters}
                                />
                            )}
                        </>
                    )}
                </Grid>
            </Grid>
        </>
    );
}

export default SearchPageView;
