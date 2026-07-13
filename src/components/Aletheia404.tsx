import React from "react";
import { useTranslations } from "next-intl";

const Aletheia404 = () => {
    const tNotFound = useTranslations("notFound");
    return (
        <div
            style={{
                width: "100%",
                marginTop: "60px",
                textAlign: "center",
                fontSize: "1rem",
                fontWeight: 600,
            }}
        >
            <div> {tNotFound("message")}</div>
        </div>
    );
};

export default Aletheia404;
