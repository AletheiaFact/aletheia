import React from "react";
import {
    Grid,
    Popover,
    Button,
    FormControl,
} from "@mui/material";
import AdvancedSearch from "../Search/AdvancedSearch";
import SelectFilter from "./SelectFilter";

const FilterPopover = ({
    anchorEl,
    onClose,
    filterType,
    setFilterType,
    setFilterValue,
    fetchTopicList,
    autoCompleteTopicsResults,
    onFilterApply,
    t,
}) => (
    <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={onClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
    >
        <Grid container spacing={2} p={2}>
            <Grid item xs={12}>
                <FormControl fullWidth>
                    <SelectFilter
                        filterType="filterByTypeLabel"
                        currentValue={filterType}
                        onValueChange={(e) => setFilterType(e)}
                    />
                </FormControl>
            </Grid>
            {filterType === "topics" && (
                <Grid item xs={12}>
                    <AdvancedSearch
                        defaultValue={[]}
                        onSearch={fetchTopicList}
                        options={autoCompleteTopicsResults}
                        handleFilter={setFilterValue}
                    />
                </Grid>
            )}
            {filterType === "impactArea" && (
                <Grid item xs={12}>
                    <AdvancedSearch
                        defaultValue={[]}
                        onSearch={fetchTopicList}
                        options={autoCompleteTopicsResults}
                        handleFilter={setFilterValue}
                    />
                </Grid>
            )}
            <Grid item xs={12} container justifyContent="flex-end">
                <Button onClick={onFilterApply}>
                    {t("verificationRequest:applyButtonLabel")}
                </Button>
            </Grid>
        </Grid>
    </Popover>
);

export default FilterPopover;
