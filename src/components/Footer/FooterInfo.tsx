import { FileTextOutlined } from "@ant-design/icons";
import { Row } from "antd";
import { useTranslation } from "next-i18next";
import React from "react";
import { useAppSelector } from "../../store/store";

import colors from "../../styles/colors";
import AletheiaButton, { ButtonType } from "../Button";

const FooterInfo = () => {
    const { t } = useTranslation();
    const { vw } = useAppSelector((state) => state);

    return (
        <Row justify={vw?.sm ? "center" : "start"}>
            <span style={{ textAlign: "justify", marginBottom: "16px" }}>
                {t("about:alertInfo")}{" "}
                <a
                    style={{
                        whiteSpace: "pre-wrap",
                        display: "inline",
                        color: colors.white,
                    }}
                    href="https://github.com/AletheiaFact/aletheia"
                    target="_blank"
                    rel="noreferrer"
                >
                    https://github.com/AletheiaFact/aletheia
                </a>
            </span>
            <AletheiaButton
                type={ButtonType.whiteBlue}
                href="https://docs.google.com/viewer?url=https://raw.githubusercontent.com/AletheiaFact/miscellaneous/290b19847f0da521963f74e7947d7863bf5d5624/documents/org_legal_register.pdf"
                target="_blank"
                rel="noreferrer"
            >
                <>
                    {t("about:labelButton")} <FileTextOutlined />
                </>
            </AletheiaButton>
        </Row>
    );
};

export default FooterInfo;
