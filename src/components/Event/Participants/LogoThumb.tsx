import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import BusinessOutlined from "@mui/icons-material/BusinessOutlined";
import colors from "../../../styles/colors";
import type { UploadFile } from "../../ImageUpload";
import { sanitizeUrl } from "../../../utils/ValidateUrl";

interface LogoThumbProps {
    logo?: UploadFile;
    size?: number;
}

/** Saved logo (url) or a freshly picked file (object URL), else an icon. */
const LogoThumb = ({ logo, size = 48 }: LogoThumbProps) => {
    const [objectUrl, setObjectUrl] = useState<string>();

    useEffect(() => {
        if (!logo?.originFileObj) {
            setObjectUrl(undefined);
            return;
        }
        const url = URL.createObjectURL(logo.originFileObj);
        setObjectUrl(url);
        return () => URL.revokeObjectURL(url);
    }, [logo?.originFileObj]);

    const src = sanitizeUrl(objectUrl ?? logo?.url);

    return (
        <Box
            sx={{
                width: size,
                height: size,
                flex: "none",
                borderRadius: "8px",
                border: `1px solid ${colors.lightNeutralSecondary}`,
                background: colors.white,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
            }}
        >
            {src ? (
                <img
                    src={src}
                    alt=""
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                    }}
                />
            ) : (
                <BusinessOutlined
                    aria-hidden="true"
                    style={{ color: colors.neutralSecondary }}
                />
            )}
        </Box>
    );
};

export default LogoThumb;
