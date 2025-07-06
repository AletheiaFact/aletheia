import React from "react";
import { Box, Paper, Typography } from "@mui/material";

export default function STFLogo() {
    return (
        <Paper
            sx={{
                p: 3,
                textAlign: "center",
                "&:hover": { boxShadow: 4 },
                transition: "box-shadow 0.3s",
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
                    backgroundColor: "white",
                    p: 1,
                }}
            >
                <img
                    src="/images/partners/stf-logo.svg"
                    alt="Supremo Tribunal Federal"
                    style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        width: "170px",
                        height: "auto",
                        objectFit: "contain",
                    }}
                    onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling.style.display = 'flex';
                    }}
                />
                <Typography
                    variant="h6"
                    sx={{
                        color: "text.secondary",
                        display: "none",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "100%",
                        height: "100%"
                    }}
                >
                    STF
                </Typography>
            </Box>
        </Paper>
    );
}
