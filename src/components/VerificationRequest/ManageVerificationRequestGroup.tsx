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
                color: colors.lightPrimary,
                textDecoration: "underline",
                cursor: "pointer",
                textAlign: "center",
            }}
        >
            {label}
            {suffix}
        </span>
    );
};

export default ManageVerificationRequestGroup;
