import { Button, ButtonProps } from "antd";
import colors from "../styles/colors";

export enum ButtonType {
    blue = "blue",
    white = "white",
    gray = "gray",
    whiteBlue = "whiteBlue",
    whiteBlack = "whiteBlack",
}

type AletheiaButtonProps = Omit<ButtonProps, "type">;
interface IAletheiaButtonProps extends AletheiaButtonProps {
    type?: ButtonType;
    event?: any;
    rounded?: boolean;
}

const AletheiaButton: (props: IAletheiaButtonProps) => JSX.Element = (
    props: IAletheiaButtonProps
) => {
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
                color: colors.bluePrimary,
            };
            break;
        case ButtonType.gray:
            buttonStyle = {
                ...buttonStyle,
                background: colors.graySecondary,
                borderColor: colors.graySecondary,
                color: colors.white,
            };
            break;
        case ButtonType.whiteBlue:
            buttonStyle = {
                ...buttonStyle,
                background: colors.bluePrimary,
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
        case ButtonType.blue:
        default:
            buttonStyle = {
                ...buttonStyle,
                background: colors.bluePrimary,
                borderColor: colors.bluePrimary,
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
