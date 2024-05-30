import { Button, ButtonProps } from "antd";
import colors from "../styles/colors";
import { useAtom } from "jotai";
import { currentNameSpace } from "../atoms/namespace";
import { NameSpaceEnum } from "../types/Namespace";
import { useLayoutEffect, useState } from "react";

export enum ButtonType {
    blue = "blue",
    white = "white",
    gray = "gray",
    whiteBlue = "whiteBlue",
    whiteBlack = "whiteBlack",
    lightBlue = "lightBlue",
}

type AletheiaButtonProps = Omit<ButtonProps, "type">;
interface IAletheiaButtonProps extends AletheiaButtonProps {
    type?: ButtonType;
    event?: any;
    rounded?: string;
}

const AletheiaButton: (props: IAletheiaButtonProps) => JSX.Element = (
    props: IAletheiaButtonProps
) => {
    const [nameSpace] = useAtom(currentNameSpace);

    const [backgroundColor, setBackgroundColor] = useState(colors.bluePrimary);
    useLayoutEffect(() => {
        setBackgroundColor(
            nameSpace === NameSpaceEnum.Main
                ? colors.bluePrimary
                : colors.blueSecondary
        );
    }, [nameSpace]);

    let buttonStyle = {
        borderWidth: "2px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: 40,
        paddingBottom: 0,
        borderRadius: props.rounded ? "30px" : "4px",
        ...props.style,
    };
    switch (props.type) {
        case ButtonType.white:
            buttonStyle = {
                ...buttonStyle,
                background: colors.white,
                borderColor: colors.white,
                color: backgroundColor,
            };
            break;
        case ButtonType.gray:
            buttonStyle = {
                ...buttonStyle,
                background: colors.lightGray,
                borderColor: colors.lightGray,
                color: backgroundColor,
            };
            break;
        case ButtonType.whiteBlue:
            buttonStyle = {
                ...buttonStyle,
                background: backgroundColor,
                borderColor: colors.white,
                color: colors.white,
            };
            break;
        case ButtonType.whiteBlack:
            buttonStyle = {
                ...buttonStyle,
                background: colors.white,
                borderColor: colors.blackSecondary,
                color: colors.blackSecondary,
            };
            break;
        case ButtonType.lightBlue:
            buttonStyle = {
                ...buttonStyle,
                background: colors.lightBlueMain,
                borderColor: colors.lightBlueMain,
                color: colors.white,
            };
            break;
        case ButtonType.blue:
        default:
            buttonStyle = {
                ...buttonStyle,
                background: backgroundColor,
                borderColor: backgroundColor,
                color: colors.white,
            };
            break;
    }

    return (
        <Button {...props} type="default" style={buttonStyle}>
            {props.children}
        </Button>
    );
};

export default AletheiaButton;
