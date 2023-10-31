import { LoadingOutlined } from "@ant-design/icons";
import { useTranslation } from "next-i18next";
import React from "react";

import colors from "../styles/colors";
import { NameSpaceEnum } from "../types/Namespace";
import { useAtom } from "jotai";
import { currentNameSpace } from "../atoms/namespace";

const Loading = ({ style = {} }) => {
    const { t } = useTranslation();
    const [nameSpace] = useAtom(currentNameSpace);
    return (
        <div
            style={{
                width: "100%",
                height: "50%",
                display: "grid",
                placeContent: "center",
                ...style,
            }}
        >
            <LoadingOutlined
                spin
                style={{
                    fontSize: 48,
                    color:
                        nameSpace === NameSpaceEnum.Main
                            ? colors.bluePrimary
                            : colors.blueSecondary,
                }}
            />
            <p
                style={{
                    color:
                        nameSpace === NameSpaceEnum.Main
                            ? colors.bluePrimary
                            : colors.blueSecondary,
                    marginTop: "24px",
                }}
            >
                {t("common:loading")}
            </p>
        </div>
    );
};

export default Loading;
