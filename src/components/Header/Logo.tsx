/* eslint-disable @next/next/no-img-element */
import React from "react";
import colors from "../../styles/colors";
import { useAtom } from "jotai";
import { currentNameSpace } from "../../atoms/namespace";
import { NameSpaceEnum } from "../../types/Namespace";
import localConfig from "../../../config/localConfig.example";
import ConfigLogo from "./ConfigLogo";
import LogoAletheia from "./LogoAletheia";

const Logo = ({
    color = colors.logo,
    height = "42px",
    width = "80px",
    lineHeight = "24px",
}) => {
    const [nameSpace] = useAtom<string>(currentNameSpace);

    if (nameSpace === NameSpaceEnum.Main) {
        return localConfig.Logo ? (
            <ConfigLogo height={height} width={width} />
        ) : (
            <LogoAletheia height={height} color={color} />
        );
    } else if (nameSpace) {
        return (
            <h1
                style={{
                    color,
                    margin: 0,
                    textTransform: "capitalize",
                    fontWeight: "bold",
                    lineHeight,
                }}
            >
                {nameSpace.replace("-", " ")}
            </h1>
        );
    }
};

export default Logo;
