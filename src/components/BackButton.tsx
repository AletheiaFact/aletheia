import { useTranslation } from "next-i18next";
import React, { CSSProperties } from "react";
import { ArrowBackOutlined } from "@mui/icons-material";
import { useRouter } from "next/router";
import colors from "../styles/colors";

function BackButton({
    style,
    callback,
    isVisible = true,
}: {
    style?: CSSProperties;
    callback?: () => void;
    isVisible?: boolean;
}) {
    const { t } = useTranslation();
    const router = useRouter();
    const pathname = router?.pathname || "";

    console.log("pthname:", pathname);
    console.log("isVisible:", isVisible);

    if (pathname !== "/" && pathname !== "/home-page" && isVisible) {
        return (
            <a
                style={{
                    display: "flex",
                    alignContent: "center",
                    fontWeight: "bold",
                    color: colors.secondary,
                    ...style,
                }}
                data-cy="testBackButton"
                onClick={() => {
                    if (callback) {
                        callback();
                    } else {
                        // TODO: check if the previous page in history is from Aletheia
                        // if it's not, go to home page
                        router.back();
                    }
                }}
            >
                <ArrowBackOutlined fontSize="small" /> {t("common:back_button")}
            </a>
        );
    } else {
        return <></>;
    }
}

export default BackButton;
