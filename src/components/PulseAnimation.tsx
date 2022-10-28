import React from "react";
import styled from "styled-components";

interface PulseAnimationProps {
    pulse: boolean;
    startColor: string;
    endColor: string;
    startSize: number;
    endSize: number;
    children: React.ReactNode;
    style?: React.CSSProperties;
}

const PulseAnimation = ({
    pulse,
    startColor,
    endColor,
    startSize,
    endSize,
    children,
    style,
}: PulseAnimationProps) => {
    const AnimatedDiv = styled.div`
        animation-name: pulse;
        animation-duration: 2s;
        animation-timing-function: ease-in-out;
        animation-direction: alternate;
        animation-iteration-count: ${pulse ? "infinite" : 0};
        animation-play-state: running;

        @keyframes pulse {
            0% {
                box-shadow: 0px 0px 0px ${startSize}px ${startColor};
            }

            100% {
                box-shadow: 0px 0px 0px ${endSize}px ${endColor};
            }
        }
    `;
    return <AnimatedDiv style={style}>{children}</AnimatedDiv>;
};

export default PulseAnimation;
