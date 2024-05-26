import React from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import colors from "../../styles/colors";
import { useAppSelector } from "../../store/store";

const CopilotCollapseDrawerButton = ({
    handleClick,
    rightPosition,
    topPosition,
    rotate,
}) => {
    const { vw } = useAppSelector((state) => ({ vw: state?.vw }));

    return (
        <div
            style={{
                position: "fixed",
                top: topPosition,
                zIndex: 999999,
                right: rightPosition,
                transition: `${vw?.sm ? "top" : "right"} 0.225s ease-in-out`,
            }}
        >
            <button
                onClick={handleClick}
                style={{
                    width: "24px",
                    height: "44px",
                    padding: "0",
                    background: "none",
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                }}
            >
                <ArrowForwardIosIcon
                    style={{
                        transform: rotate,
                        color: colors.blackSecondary,
                    }}
                />
            </button>
        </div>
    );
};

export default CopilotCollapseDrawerButton;
