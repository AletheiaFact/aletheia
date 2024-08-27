import React from "react";
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
import AdvancedSearch from "../Search/AdvancedSearch";

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
                    <InputLabel>
                        {t("verificationRequest:filterByTypeLabel")}
                    </InputLabel>
                    <Select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        label="Filter by Type"
                    >
                        <MenuItem value="topics">
                            {t("verificationRequest:topicsFilterOption")}
                        </MenuItem>
                        <MenuItem value="content">
                            {t("verificationRequest:contentFilterOption")}
                        </MenuItem>
                    </Select>
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
            {filterType === "content" && (
                <Grid item xs={12}>
                    <TextField
                        label={t("verificationRequest:filterByContentLabel")}
                        onChange={(e) => setFilterValue(e.target.value)}
                        fullWidth
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
