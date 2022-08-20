import { FilePdfOutlined } from "@ant-design/icons";
import { Alert, Button } from "antd";
import { useTranslation } from "next-i18next";
import React from "react";

const InfoAlert = () => {
    const { t } = useTranslation();
    return (
        <Alert
            type="info"
            style={{
                marginBottom: "15px",
                padding: "50px 25px 50px 25px",
            }}
            message={
                <>
                    {t("about:alertInfo")}{" "}
                    <a
                        style={{ whiteSpace: "pre-wrap" }}
                        href="https://github.com/AletheiaFact/aletheia"
                        target="_blank"
                        rel="noreferrer"
                    >
                        https://github.com/AletheiaFact/aletheia
                    </a>
                </>
            }
            action={
                <Button
                    type="primary"
                    size="small"
                    shape="round"
                    icon={<FilePdfOutlined />}
                    href="https://docs.google.com/viewer?url=https://raw.githubusercontent.com/AletheiaFact/miscellaneous/290b19847f0da521963f74e7947d7863bf5d5624/documents/org_legal_register.pdf"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                        position: "absolute",
                        bottom: "15px",
                        right: "15px",
                    }}
                >
                    {t("about:labelButton")}
                </Button>
            }
        />
    );
};

export default InfoAlert;
