import { Button, ButtonProps, Tooltip } from "antd";
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
    return (
        <Tooltip placement="left" title={tooltipText}>
            <Button
                style={{
                    background: colors.white,
                    color:
                        nameSpaceProp === NameSpaceEnum.Main
                            ? colors.bluePrimary
                            : colors.blueSecondary,
                    boxShadow: "rgba(0, 0, 0, 0.35) 0px 8px 24px",
                    display: "grid",
                    placeContent: "center",
                    width: size,
                    height: size,
                    ...style,
                }}
                shape="circle"
                type="link"
                icon={icon}
                {...rest}
            />
        </Tooltip>
    );
};

export default Fab;
