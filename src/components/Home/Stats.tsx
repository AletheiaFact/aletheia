import React from "react";
import { useAppSelector } from "../../store/store";
import colors from "../../styles/colors";

export const Stats = ({ info, title }) => {
    const { vw } = useAppSelector((state) => state);
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                width: "33%",
                justifyContent: vw?.sm ? "center" : "flex-start",
            }}
        >
            <h3
                style={{
                    color: colors.lightBlueSecondary,
                    marginRight: vw?.sm ? "5px" : "20px",
                    marginBottom: 0,
                    fontSize: vw?.sm ? "20px" : "40px",
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
