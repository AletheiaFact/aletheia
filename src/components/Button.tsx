import { Button } from "antd";
import colors from "../styles/colors";

enum ButtonType {
    blue = "blue",
    white = "white",
    gray = "gray",
    whiteBlue = "whiteBlue",
    whiteBlack = "whiteBlack",
}

const AletheiaButton: (
    {
        children,
        href,
        type,
        style
    }: {
        target: any,
        children: any;
        href: any;
        type: ButtonType,
        style: any
    }) => JSX.Element = ({ target, children, href, type, style }) => {
    let buttonStyle = {
        ...style,
        borderWidth: "2px",
        borderRadius: "30px",
    };
    switch (type) {
        case ButtonType.white:
            buttonStyle = {
                ...buttonStyle,
                background: colors.white,
                borderColor: colors.white,
                color: colors.bluePrimary
            }
            break;
        case ButtonType.gray:
            buttonStyle = {
                ...buttonStyle,
                background: colors.graySecondary,
                borderColor: colors.graySecondary,
                color: colors.white
            }
            break;
        case ButtonType.whiteBlue:
            buttonStyle = {
                ...buttonStyle,
                background: colors.white,
                borderColor: colors.bluePrimary,
                color: colors.bluePrimary
            }
            break;
        case ButtonType.whiteBlack:
            buttonStyle = {
                ...buttonStyle,
                background: colors.white,
                borderColor: colors.black,
                color: colors.black
            }
            break;
        case ButtonType.blue:
        default:
            buttonStyle = {
                ...buttonStyle,
                background: colors.blueSecondary,
                borderColor: colors.blueSecondary,
                color: colors.white
            }
            break;
    }

    return (
        <Button
            style={buttonStyle}
            href={href}
            target={target}
        >
            {children}
        </Button>
    )
}

export default AletheiaButton;
