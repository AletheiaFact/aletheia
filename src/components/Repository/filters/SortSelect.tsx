import React from "react";
import { MenuItem, Select, SelectProps } from "@mui/material";
import { useTranslation } from "next-i18next";
import colors from "../../../styles/colors";
import { SortOrder } from "../repositoryFilters";

interface SortSelectProps {
    value: SortOrder;
    onChange: (order: SortOrder) => void;
    id?: string;
    fullWidth?: boolean;
    sx?: SelectProps["sx"];
    inputProps?: SelectProps["inputProps"];
}

// Used in the desktop toolbar and in the phone filters sheet
const SortSelect = ({
    value,
    onChange,
    id,
    fullWidth,
    sx,
    inputProps,
}: SortSelectProps) => {
    const { t } = useTranslation();

    return (
        <Select
            size="small"
            id={id}
            fullWidth={fullWidth}
            value={value}
            onChange={(event) => onChange(event.target.value as SortOrder)}
            inputProps={inputProps}
            sx={{ backgroundColor: colors.white, ...sx }}
            data-cy="testRepositorySort"
        >
            <MenuItem value="desc">{t("repository:sortNewest")}</MenuItem>
            <MenuItem value="asc">{t("repository:sortOldest")}</MenuItem>
        </Select>
    );
};

export default SortSelect;
