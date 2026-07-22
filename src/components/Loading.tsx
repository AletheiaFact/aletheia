import { CircularProgress } from "@mui/material";
import React from "react";

import colors from "../styles/colors";
import { NameSpaceEnum } from "../types/Namespace";
import { useAtom } from "jotai";
import { currentNameSpace } from "../atoms/namespace";
import { useTranslations } from "next-intl";

const Loading = ({ style = {}, isWhiteLoading = false }) => {
    const tCommon = useTranslations("common");
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
                {tCommon("loading")}
            </p>
        </div>
    );
};

export default Loading;
