import React from "react";
import { useAppSelector } from "../../store/store";
import colors from "../../styles/colors";

export const Stats = ({ info, title, style = {} }) => {
    const { vw } = useAppSelector((state) => state);
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                width: "33%",
                gap: "4px",
                justifyContent: "center",
                ...style,
            }}
        >
            <h3
                style={{
                    color: colors.lightBlueSecondary,
                    marginRight: vw?.sm ? "5px" : "20px",
                    marginBottom: 0,
                    fontSize: vw?.sm ? "28px" : "40px",
                }}
            >
                {info}
            </h3>{" "}
            <span
                style={{
                    marginTop: "0.25em",
                    fontSize: vw?.sm ? "14px" : "20px",
                }}
            >
                {title}
            </span>
        </div>
    );
};
