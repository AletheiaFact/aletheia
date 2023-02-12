/* eslint-disable @next/next/no-img-element */
import React from "react";

const ImageClaim = ({ src, title = "" }) => {
    return (
        <img
            src={src}
            alt={`${title} claim`}
            style={{
                maxWidth: "100%",
                maxHeight: "5.5em",
                objectFit: "contain",
            }}
        />
    );
};

export default ImageClaim;
