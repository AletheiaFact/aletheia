import { Button, ButtonProps, SxProps, Theme } from "@mui/material";
import { useLayoutEffect, useMemo, useState } from "react";
import { useAtom } from "jotai";
import colors from "../styles/colors";
import { currentNameSpace } from "../atoms/namespace";
import { NameSpaceEnum } from "../types/Namespace";

export enum ButtonType {
    primary = "primary",
    secondary = "secondary",
    outline = "outline",
    white = "white",
    gray = "gray",
    whiteBlue = "whiteBlue",
    whiteBlack = "whiteBlack",
    lightBlue = "lightBlue",
    error = "error",
    text = "text",
}

export type AletheiaButtonSize = "small" | "medium" | "large";

type AletheiaButtonProps = Omit<ButtonProps, "type" | "size">;

interface IAletheiaButtonProps extends AletheiaButtonProps {
    type?: ButtonType;
    event?: string;
    rounded?: boolean;
    loading?: boolean;
    htmlType?: "button" | "submit" | "reset";
    target?: "_blank" | "_self" | "_parent" | "_top";
    fullWidth?: boolean;
    size?: AletheiaButtonSize;
    fontWeight?: number | string;
}

const SIZE_STYLES: Record<AletheiaButtonSize, { height: number; fontSize: string; padding: string }> = {
    small: { height: 32, fontSize: "12px", padding: "4px 12px" },
    medium: { height: 40, fontSize: "12px", padding: "6px 16px" },
    large: { height: 48, fontSize: "14px", padding: "8px 24px" },
};

type VariantStyle = {
    background: string;
    borderColor: string;
    color: string;
    hoverBackground: string;
    hoverBorderColor: string;
    hoverColor?: string;
};

const getVariantStyle = (
    type: ButtonType | undefined,
    namespaceColor: string
): VariantStyle => {
    switch (type) {
        case ButtonType.primary:
            return {
                background: colors.primary,
                borderColor: colors.primary,
                color: colors.white,
                hoverBackground: colors.primaryHover,
                hoverBorderColor: colors.primaryHover,
            };
        case ButtonType.secondary:
            return {
                background: colors.secondary,
                borderColor: colors.secondary,
                color: colors.white,
                hoverBackground: colors.tertiary,
                hoverBorderColor: colors.tertiary,
            };
        case ButtonType.outline:
            return {
                background: "transparent",
                borderColor: colors.neutralTertiary,
                color: colors.blackSecondary,
                hoverBackground: colors.lightNeutral,
                hoverBorderColor: colors.neutralSecondary,
            };
        case ButtonType.white:
            return {
                background: colors.white,
                borderColor: colors.white,
                color: namespaceColor,
                hoverBackground: colors.lightNeutral,
                hoverBorderColor: colors.lightNeutral,
            };
        case ButtonType.gray:
            return {
                background: colors.lightNeutral,
                borderColor: colors.lightNeutral,
                color: namespaceColor,
                hoverBackground: colors.lightNeutralSecondary,
                hoverBorderColor: colors.lightNeutralSecondary,
            };
        case ButtonType.whiteBlue:
            return {
                background: namespaceColor,
                borderColor: colors.white,
                color: colors.white,
                hoverBackground: colors.lightPrimary,
                hoverBorderColor: colors.white,
            };
        case ButtonType.whiteBlack:
            return {
                background: colors.white,
                borderColor: colors.blackSecondary,
                color: colors.blackSecondary,
                hoverBackground: colors.lightNeutral,
                hoverBorderColor: colors.black,
                hoverColor: colors.black,
            };
        case ButtonType.lightBlue:
            return {
                background: colors.lightPrimary,
                borderColor: colors.lightPrimary,
                color: colors.white,
                hoverBackground: colors.lightSecondary,
                hoverBorderColor: colors.lightSecondary,
            };
        case ButtonType.error:
            return {
                background: colors.error,
                borderColor: colors.error,
                color: colors.white,
                hoverBackground: colors.critical,
                hoverBorderColor: colors.critical,
            };
        case ButtonType.text:
            return {
                background: "transparent",
                borderColor: "transparent",
                color: namespaceColor,
                hoverBackground: colors.primaryHover,
                hoverBorderColor: "transparent",
            };
        default:
            return {
                background: namespaceColor,
                borderColor: namespaceColor,
                color: colors.white,
                hoverBackground: colors.lightPrimary,
                hoverBorderColor: colors.lightPrimary,
            };
    }
};

const AletheiaButton: React.FC<IAletheiaButtonProps> = (props) => {
    const {
        children,
        type,
        rounded,
        htmlType,
        style,
        sx,
        fullWidth,
        size = "medium",
        fontWeight,
        ...restProps
    } = props;

    const [nameSpace] = useAtom(currentNameSpace);
    const [namespaceColor, setNamespaceColor] = useState(colors.primary);

    useLayoutEffect(() => {
        setNamespaceColor(
            nameSpace === NameSpaceEnum.Main ? colors.primary : colors.secondary
        );
    }, [nameSpace]);

    const variant = useMemo(
        () => getVariantStyle(type, namespaceColor),
        [type, namespaceColor]
    );

    const sizeStyle = SIZE_STYLES[size];

    const buttonSx: SxProps<Theme> = {
        borderWidth: "2px",
        borderStyle: "solid",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: sizeStyle.height,
        padding: sizeStyle.padding,
        width: fullWidth ? "100%" : undefined,
        borderRadius: rounded ? "30px" : "4px",
        fontSize: sizeStyle.fontSize,
        fontWeight,
        lineHeight: "16px",
        textTransform: "none",
        transition:
            "background-color 150ms ease, border-color 150ms ease, color 150ms ease",
        background: variant.background,
        borderColor: variant.borderColor,
        color: variant.color,
        "&:hover": {
            borderWidth: "2px",
            background: variant.hoverBackground,
            borderColor: variant.hoverBorderColor,
            color: variant.hoverColor ?? variant.color,
        },
        "&.Mui-disabled": {
            opacity: 0.6,
            color: variant.color,
            background: variant.background,
            borderColor: variant.borderColor,
        },
        ...(sx as object),
    };

    return (
        <Button
            type={htmlType || "button"}
            variant="outlined"
            sx={buttonSx}
            style={style}
            {...restProps}
        >
            <span
                style={{
                    alignItems: "center",
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "3px",
                }}
            >
                {children}
            </span>
        </Button>
    );
};

export default AletheiaButton;
