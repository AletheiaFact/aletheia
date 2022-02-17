import React from "react";
import { useTranslation } from "next-i18next";

const Aletheia404 = () => {
    const { t } = useTranslation();
    return (
        <div
            style={{
                width: '100%',
                marginTop: '60px',
                textAlign: 'center',
                fontSize: "1rem",
                fontWeight: 500,
            }}
        >
            <div> {t("notFound:message")}</div>
        </div>
    );
}

export default Aletheia404
