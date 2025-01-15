import { styled, Tooltip, tooltipClasses, TooltipProps } from "@mui/material";
import React from "react";
import colors from "../../styles/colors";

type InfoTooltipProps = {
    placement?: TooltipProps["placement"];
    content: React.ReactNode;
    children: React.ReactElement;
    useCustomStyle?: boolean;
};

const DefaultTooltip = ({ className, ...props }: TooltipProps) => {
    return (
        <Tooltip {...props} arrow
            title={
                <span style={{ fontSize: 15 }}>
                    {props.title}
                </span>
            }
        >
            {props.children}
        </Tooltip>
    );
};

const InfoTooltip: React.FC<InfoTooltipProps> = ({
    placement = "top",
    content,
    children,
    useCustomStyle = true,
}) => {

    const CustomTooltip = styled(({ className, ...props }: TooltipProps) => (
        <Tooltip {...props} arrow classes={{ popper: className }} />
    ))(() => ({
        [`& .${tooltipClasses.arrow}`]: {
            color: colors.white,
        },
        [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: colors.white,
            maxWidth: "100%",
            boxShadow: `0px 0px 15px ${colors.shadow}`,
        },
    }));


    const TooltipComponent = useCustomStyle ? CustomTooltip : DefaultTooltip;

    return (
        <TooltipComponent placement={placement} title={content}>
            {children}
        </TooltipComponent>
    );
};

export default InfoTooltip;
