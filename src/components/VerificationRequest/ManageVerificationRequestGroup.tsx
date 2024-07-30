import React from "react";
import colors from "../../styles/colors";

const ManageVerificationRequestGroup = ({
    label,
    openDrawer,
    suffix = null,
}) => {
    const onKeyDown = (e) => {
        if (e.key === "Enter" || e.key === "Space") {
            e.preventDefault();
            openDrawer();
        }
    };

    return (
        <span
            onClick={openDrawer}
            role="button"
            aria-pressed="false"
            tabIndex={0}
            onKeyDown={onKeyDown}
            style={{
                color: colors.lightBlueMain,
                textDecoration: "underline",
                cursor: "pointer",
                textAlign: "center",
            }}
        >
            {label}
            {suffix && suffix}
        </span>
    );
};

export default ManageVerificationRequestGroup;
