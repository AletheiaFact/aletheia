/* eslint-disable @next/next/no-img-element */
import React from "react";
import colors from "../../styles/colors";
import { useAtom } from "jotai";
import { currentNameSpace } from "../../atoms/namespace";
import { NameSpaceEnum } from "../../types/Namespace";
import Image from "next/image";

const Logo = ({
    color = colors.logoWhite,
    height = "42px",
    width = "80px",
    lineHeight = "24px",
}) => {
    const [nameSpace] = useAtom<string>(currentNameSpace);
    const logoSvgPath = process.env.LOGO_SVG_PATH || '/images/logo1_white.svg';
    if (nameSpace === NameSpaceEnum.Main) {
        return (
            <Image
                alt="logo"
                src={logoSvgPath}
                height={height}
                width={width}
            />
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
