/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Box } from "@mui/material";

interface ImageClaimProps {
    src: string;
    title?: string;
}

const ImageClaim: React.FC<ImageClaimProps> = ({ src, title = "" }) => {
    return (
        <Box
            sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#f5f5f5",
                borderRadius: "8px",
                overflow: "hidden",
                marginTop: "16px",
                marginBottom: "16px",
                minHeight: { xs: "120px", sm: "150px", md: "200px" },
                maxHeight: { xs: "180px", sm: "250px", md: "320px" },
            }}
        >
            <img
                src={src}
                alt={`${title} claim`}
                loading="lazy"
                style={{
                    width: "100%",
                    height: "auto",
                    maxHeight: "100%",
                    objectFit: "contain",
                    display: "block",
                }}
            />
        </Box>
    );
};

export default ImageClaim;
