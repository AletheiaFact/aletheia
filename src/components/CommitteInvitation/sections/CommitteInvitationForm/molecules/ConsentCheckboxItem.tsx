import React from "react";
import { Box, Checkbox, SxProps, Typography } from "@mui/material";

interface ConsentCheckboxItemProps {
    checked: boolean;
    error?: boolean;
    lead: string;
    description: string;
    onChange: (checked: boolean) => void;
    sx?: SxProps;
}

const ConsentCheckboxItem = ({
    checked,
    error,
    lead,
    description,
    onChange,
    sx,
}: ConsentCheckboxItemProps) => (
    <Box className={`consent-item ${error ? "error" : ""}`} sx={sx}>
        <Checkbox
            checked={checked}
            onChange={(event) => onChange(event.target.checked)}
        />
        <Typography variant="body2">
            <strong>{lead}</strong> {description}
            <Box component="span" className="required-asterisk"> *</Box>
        </Typography>
    </Box>
);

export default ConsentCheckboxItem;
