import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import Image from "next/image";

export default function UFSMLogo() {
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
                <Image
                    src="/images/partners/ufsm-logo.jpg"
                    alt="Universidade Federal de Santa Maria"
                    width={150}
                    height={150}
                    unoptimized
                    style={{
                        objectFit: "contain",
                    }}
                    onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextSibling.style.display = 'flex';
                    }}
                />
                <Typography
                    variant="body1"
                    sx={{
                        color: "text.secondary",
                        display: "none",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "100%",
                        height: "100%"
                    }}
                >
                    UFSM
                </Typography>
            </Box>
        </Paper>
    );
}
