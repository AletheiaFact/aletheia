interface PositionStyle {
    topPosition: string;
    rightPosition: string;
    rotate: string;
}

interface ViewWidth {
    sm: boolean;
    md?: boolean;
}

export const calculatePosition = (
    open: boolean,
    vw: ViewWidth
): PositionStyle => {
    if (!vw.sm) {
        return {
            topPosition: "50%",
            rotate: open ? "rotateY(45deg)" : "rotateY(135deg)",
            rightPosition: open ? "350px" : "16px",
        };
    }

    return {
        rightPosition: "50%",
        rotate: open ? "rotate(90deg)" : "rotate(270deg)",
        topPosition: open ? "50%" : "calc(100% - 64px)",
    };
};
