import React from "react";
import colors from "../../styles/colors";

const ForgotPasswordLink = ({ t }) => {
    const href = "/api/.ory/self-service/recovery/browser";

    return (
        <a
            href={href}
            style={{
                fontSize: 14,
                color: colors.blackPrimary,
                fontWeight: "bold",
                textDecoration: "underline",
                width: "180px",
            }}
        >
            {t("login:forgotPassword")}
        </a>
    );
};

export default ForgotPasswordLink;
