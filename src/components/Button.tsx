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
        type
    }: {
        target: any,
        children: any;
        href: any;
        type: ButtonType
    }) => JSX.Element = ({ target, children, href, type }) => {
    let style = {
        borderWidth: "2px",
        borderRadius: "30px",
    };
    switch (type) {
        case ButtonType.white:
            style = {
                ...style,
                background: colors.white,
                borderColor: colors.white,
                color: colors.bluePrimary
            }
            break;
        case ButtonType.gray:
            style = {
                ...style,
                background: colors.graySecondary,
                borderColor: colors.graySecondary,
                color: colors.white
            }
            break;
        case ButtonType.whiteBlue:
            style = {
                ...style,
                background: colors.white,
                borderColor: colors.bluePrimary,
                color: colors.bluePrimary
            }
            break;
        case ButtonType.whiteBlack:
            style = {
                ...style,
                background: colors.white,
                borderColor: colors.black,
                color: colors.black
            }
            break;
        case ButtonType.blue:
        default:
            style = {
                ...style,
                background: colors.bluePrimary,
                borderColor: colors.bluePrimary,
                color: colors.white
            }
            break;
    }

    return (
        <Button
            style={style}
            href={href}
            target={target}
        >
            {children}
        </Button>
    )
}

export default AletheiaButton;
