import { useTranslation } from "next-i18next";
import React from "react";
import { ArrowLeftOutlined } from "@ant-design/icons";
import {useRouter} from "next/router";

function BackButton({ style, callback }) {
    const { t } = useTranslation();
    const router = useRouter();
    const pathname = router.pathname || "";

    if (pathname !== "/" && pathname !== "/newhome") {
        return (
            <a
                className="back-button"
                style={{
                    fontWeight: "bold",
                    ...style
                }}
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
