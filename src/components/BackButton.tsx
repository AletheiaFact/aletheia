import { useTranslation } from "next-i18next";
import React, { CSSProperties } from "react";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import colors from "../styles/colors";

function BackButton({ style, callback }: { style?: CSSProperties; callback?: () => void }) {
    const { t } = useTranslation();
    const router = useRouter();
    const pathname = router.pathname || "";

    if (pathname !== "/" && pathname !== "/home-page") {
        return (
            <a
                style={{
                    fontWeight: "bold",
                    color: colors.secondary,
                    ...style
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
                <ArrowLeftOutlined /> {t("common:back_button")}
            </a>
        );
    } else {
        return <></>;
    }
}

export default BackButton;
