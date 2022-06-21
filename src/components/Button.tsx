import { Button, ButtonProps } from "antd";
import colors from "../styles/colors";

export enum ButtonType {
    blue = "blue",
    white = "white",
    gray = "gray",
    whiteBlue = "whiteBlue",
    whiteBlack = "whiteBlack",
}

type AletheiaButtonProps = Omit<ButtonProps, 'type'>
interface IAletheiaButtonProps extends AletheiaButtonProps {
    type?: ButtonType;
    event?: any;
}

const AletheiaButton: (
    props: IAletheiaButtonProps) => JSX.Element = (
        props: IAletheiaButtonProps) => {
        let buttonStyle = {
            ...props.style,
            borderWidth: "2px",
            borderRadius: "30px",
        };
        switch (props.type) {
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
                    borderColor: colors.blackSecondary,
                    color: colors.blackSecondary
                }
                break;
            case ButtonType.blue:
            default:
                buttonStyle = {
                    ...buttonStyle,
                    background: colors.bluePrimary,
                    borderColor: colors.bluePrimary,
                    color: colors.white
                }
                break;
        }

        return (
            <Button {...props} type='default' style={buttonStyle}
            >
                {props.children}
            </Button>
        )
    }

export default AletheiaButton;
