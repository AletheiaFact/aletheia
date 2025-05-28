import React from "react";
import colors from "../styles/colors";
import Typography from "@mui/material/Typography"

const Label = ({ children, required = false }) => {
    return (
        <span style={{ color: colors.error, display: "flex", gap: "4px" }}>
            {required && "* "}
            <Typography variant="body2" style={{ color: colors.blackSecondary, fontWeight: 600 }}>
                {children}
            </Typography>
        </span>
    );
};

export default Label;
