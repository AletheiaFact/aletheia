import { ButtonProps, IconButton } from "@mui/material";
import InfoTooltip from "../Claim/InfoTooltip";
import React, { useLayoutEffect, useState } from "react";
import colors from "../../styles/colors";
import { NameSpaceEnum } from "../../types/Namespace";
import { useAtom } from "jotai";
import { currentNameSpace } from "../../atoms/namespace";

interface FabProps extends Omit<ButtonProps, "shape" | "type" | "size"> {
    tooltipText: string;
    icon: React.ReactNode;
    size: number | string;
}

const Fab = ({ tooltipText, style, icon, size, ...rest }: FabProps) => {
    const [nameSpace] = useAtom(currentNameSpace);
    const [nameSpaceProp, setNameSpaceProp] = useState(NameSpaceEnum.Main);

    useLayoutEffect(() => {
        setNameSpaceProp(nameSpace);
    }, [nameSpace]);

    const TooltipBanner = (
        <IconButton
            style={{
                background: colors.white,
                color:
                    nameSpaceProp === NameSpaceEnum.Main
                        ? colors.primary
                        : colors.secondary,
                boxShadow: `0px 8px 24px ${colors.shadow}`,
                display: "grid",
                placeContent: "center",
                width: size,
                height: size,
                ...style,
            }}
            {...rest}
        >
            {icon}
        </IconButton>
    );

    return (
        <InfoTooltip
            useCustomStyle={false}
            placement="left"
            children={TooltipBanner}
            content={tooltipText}
        />
    );
};

export default Fab;
