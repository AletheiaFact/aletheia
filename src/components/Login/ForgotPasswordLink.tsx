import React from "react";
import colors from "../../styles/colors";
import { useTranslations } from "next-intl";

const ForgotPasswordLink = () => {
    const href = "/api/.ory/self-service/recovery/browser";
    const tLogin = useTranslations("login")

    return (
        <a
            href={href}
            style={{
                fontSize: 14,
                color: colors.black,
                fontWeight: "bold",
                textDecoration: "underline",
                width: "180px",
            }}
        >
            {tLogin("forgotPassword")}
        </a>
    );
};

export default ForgotPasswordLink;
