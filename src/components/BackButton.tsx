import { useTranslation } from "next-i18next";
import React, { CSSProperties } from "react";
import { ArrowBackOutlined } from "@mui/icons-material";
import { useRouter } from "next/router";
import colors from "../styles/colors";

interface BackButtonProps {
    style?: CSSProperties;
    callback?: () => void;
    isVisible?: boolean;
}

const BackButton: React.FC<BackButtonProps> = ({
    style,
    callback,
    isVisible = true,
}) => {
    const { t } = useTranslation();
    const router = useRouter();
    const pathname = router?.pathname || "";

    if (!isVisible || pathname === "/" || pathname === "/home-page") {
        return null;
    }

    const handleClick = () => {
        if (callback) {
            callback();
        } else {
            router.back();
        }
    };

    return (
        <button
            style={{
                display: "flex",
                fontWeight: "bold",
                color: colors.secondary,
                background: "none",
                border: "none",
                cursor: "pointer",
                ...style,
            }}
            data-cy="testBackButton"
            onClick={handleClick}
        >
            <ArrowBackOutlined fontSize="small" />
            {t("common:back_button")}
        </button>
    );
};

export default BackButton;
