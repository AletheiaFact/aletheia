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
    let rightPosition = "16px";
    let topPosition = "50%";
    let rotate = "rotateY(135deg)";

    if (!vw.sm) {
        rightPosition = open ? "350px" : "16px";
        rotate = open ? "rotateY(45deg)" : "rotateY(135deg)";
    } else {
        rightPosition = "50%";
        rotate = open ? "rotate(90deg)" : "rotate(270deg)";
        topPosition = open ? "50%" : "calc(100% - 64px)";
    }

    return { topPosition, rightPosition, rotate };
};
