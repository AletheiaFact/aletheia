import { Button, ButtonProps } from "@mui/material";
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
    loading?: boolean;
    htmlType?: "button" | "submit" | "reset";
    icon?: any;
    target?: "_blank" | "_self" | "_parent" | "_top";
}

const AletheiaButton: React.FC<IAletheiaButtonProps> = (props) => {
    const { children, type, rounded, htmlType, style, ...restProps } = props;

    const [nameSpace] = useAtom(currentNameSpace);

    const [backgroundColor, setBackgroundColor] = useState(colors.primary);

    useLayoutEffect(() => {
        setBackgroundColor(
            nameSpace === NameSpaceEnum.Main ? colors.primary : colors.secondary
        );
    }, [nameSpace]);

    let buttonStyle = {
        borderWidth: "2px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: 40,
        borderRadius: props.rounded ? "30px" : "4px",
        fontSize: "12px",
        lineHeight: "16px",
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
                background: colors.lightNeutral,
                borderColor: colors.lightNeutral,
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
                background: colors.lightPrimary,
                borderColor: colors.lightPrimary,
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
        <Button type={htmlType || "button"} variant="outlined" style={buttonStyle} {...restProps}>
            {props.icon &&
                <span
                    style={{
                        alignItems: 'center',
                        marginRight: '4px',
                        display: 'flex',
                        justifyContent: 'center'
                    }}
                >
                    {props.icon}
                </span>
            }
                <span
                    style={{
                        alignItems: 'center',
                        display: 'flex',
                        justifyContent: 'center',
                        marginTop: '3px'
                    }}
                >
                    {children}
                </span>
        </Button>
    );
};

export default AletheiaButton;
