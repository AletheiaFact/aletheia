import { Avatar } from "@mui/material";
import React from "react";
import colors from "../styles/colors";

interface AletheiaAvatarProps {
    size: number;
    src: string;
    alt: string;
}

const AletheiaAvatar = ({ size, src, alt }: AletheiaAvatarProps) => {
    const thinBorder = size < 100;
    const borderWidth = thinBorder ? size * 0.02 : 2;
    const borderGap = borderWidth * 6;

    return (
        <div
            style={{
                width: size + borderGap,
                height: size + borderGap,
                border: `${borderWidth}px solid ${colors.quartiary}`,
                display: "grid",
                placeContent: "center",
                borderRadius: "50%",
                aspectRatio: "1",
            }}
        >
            <Avatar sx={{width: size, height: size}} src={src} alt={alt} />
        </div>
    );
};

export default AletheiaAvatar;
