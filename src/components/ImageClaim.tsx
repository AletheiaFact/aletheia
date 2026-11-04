/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Box } from "@mui/material";

interface ImageClaimProps {
    src: string;
    title?: string;
}

const SAFE_IMAGE_SRC = /^(https?:\/\/|blob:|data:image\/|\/(?!\/))/i;

const ImageClaim: React.FC<ImageClaimProps> = ({ src, title = "" }) => {
    const safeSrc = SAFE_IMAGE_SRC.test(src?.trim() ?? "") ? src.trim() : "";
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
                src={safeSrc}
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
