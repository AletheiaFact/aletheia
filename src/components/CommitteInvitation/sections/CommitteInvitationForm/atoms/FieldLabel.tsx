import React from "react";
import { Box, SxProps, Typography } from "@mui/material";

interface FieldLabelProps {
    children: React.ReactNode;
    required?: boolean;
    sx?: SxProps;
}

const FieldLabel = ({ children, required, sx }: FieldLabelProps) => (
    <Typography variant="body2" className="field-label" sx={sx}>
        {children} {required && <Box component="span" className="required-asterisk"> *</Box>}
    </Typography>
);

export default FieldLabel;
