import React from "react";
import { InputAdornment, MenuItem, Select, SelectProps } from "@mui/material";
import SortIcon from "@mui/icons-material/Sort";
import { useTranslation } from "next-i18next";
import colors from "../../../styles/colors";
import { SortOrder } from "../repositoryFilters";

interface SortSelectProps {
    value: SortOrder;
    onChange: (order: SortOrder) => void;
    sx?: SelectProps["sx"];
}

const SortSelect = ({ value, onChange, sx }: SortSelectProps) => {
    const { t } = useTranslation();

    return (
        <Select
            size="small"
            value={value}
            onChange={(event) => onChange(event.target.value as SortOrder)}
            inputProps={{ "aria-label": t("repository:sortBy") }}
            startAdornment={
                <InputAdornment position="start">
                    <SortIcon fontSize="small" />
                </InputAdornment>
            }
            sx={{ backgroundColor: colors.white, fontSize: 14, ...sx }}
            data-cy="testRepositorySort"
        >
            <MenuItem value="desc">{t("repository:sortNewest")}</MenuItem>
            <MenuItem value="asc">{t("repository:sortOldest")}</MenuItem>
        </Select>
    );
};

export default SortSelect;
