import { CircularProgress } from "@mui/material";
import { useTranslation } from "next-i18next";
import React from "react";

import colors from "../styles/colors";
import { NameSpaceEnum } from "../types/Namespace";
import { useAtom } from "jotai";
import { currentNameSpace } from "../atoms/namespace";

const Loading = ({ style = {}, isWhiteLoading = false }) => {
    const { t } = useTranslation();
    const [nameSpace] = useAtom(currentNameSpace);

    const activeColor = isWhiteLoading
        ? colors.white
        : nameSpace === NameSpaceEnum.Main
            ? colors.primary
            : colors.secondary;

    return (
        <div
            style={{
                width: "100%",
                height: "50vh",
                display: "grid",
                placeContent: "center",
                justifyItems: "center",
                ...style,
            }}
        >
            <CircularProgress
                style={{
                    fontSize: 48,
                    color: activeColor,
                }}
            />
            <p
                style={{
                    color: activeColor,
                    marginTop: "24px",
                }}
            >
                {t("common:loading")}
            </p>
        </div>
    );
};

export default Loading;
