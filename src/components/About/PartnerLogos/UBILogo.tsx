import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import colors from "../../../styles/colors";

export default function UBILogo() {
    return (
        <Paper
            sx={{
                p: 3,
                textAlign: "center",
                "&:hover": { boxShadow: 4 },
                transition: "box-shadow 0.3s",
                border: 1,
                borderColor: "grey.200",
                height: "100%",
                display: "flex",
                alignItems: "center",
            }}
        >
            <Box
                sx={{
                    width: "100%",
                    height: 150,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    backgroundColor: colors.primary,
                    borderRadius: 1,
                    border: "1px solid",
                    borderColor: colors.lightPrimary,
                    p: 1,
                }}
            >
                <img
                    src="/images/partners/ubi-logo.svg"
                    alt="Universidade da Beira Interior"
                    style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        width: "auto",
                        height: "auto",
                        objectFit: "contain",
                    }}
                    onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling.style.display = 'flex';
                    }}
                />
                <Typography
                    variant="body1"
                    sx={{
                        color: "white",
                        display: "none",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "100%",
                        height: "100%"
                    }}
                >
                    UBI
                </Typography>
            </Box>
        </Paper>
    );
}
