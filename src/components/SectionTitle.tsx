import React from "react";
import colors from "../styles/colors";
import Typography from "@mui/material/Typography"

const SectionTitle = (props) => {
    return (
        <Typography 
            variant="h2"
            style={{
                fontFamily:"initial",
                fontSize: "24px",
                lineHeight: "32px",
                margin: "0 0 16px 0",
                fontWeight: 500,
                color: colors.neutral,
            }}
        >
            {props.children}
        </Typography >
    );
};

export default SectionTitle;
