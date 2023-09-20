import React from "react";
import styled from "styled-components";

interface PulseAnimationProps {
    pulse: boolean;
    children: React.ReactNode;
    style?: React.CSSProperties;
}

const CtaAnimation = ({ children, style }: PulseAnimationProps) => {
    const AnimatedDiv = styled.div`
        width: 70px;
        height: 70px;
        transform: translateX(40px);
        transition: transform 0.8s ease-in-out;

        &:hover {
            transform: translateX(-10px);
        }
    `;

    return <AnimatedDiv style={style}>{children}</AnimatedDiv>;
};

export default CtaAnimation;
