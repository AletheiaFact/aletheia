import { FileTextOutlined } from "@ant-design/icons";
import { Row } from "antd";
import { useTranslation } from "next-i18next";
import React from "react";
import { useAppSelector } from "../../store/store";

import colors from "../../styles/colors";
import AletheiaButton, { ButtonType } from "../Button";
import localConfig from "../../../config/localConfig.example";

const FooterInfo = () => {
    const { t } = useTranslation();
    const { vw } = useAppSelector((state) => state);
    const href = " https://github.com/AletheiaFact/aletheia"

    return (
        <Row justify={vw?.sm ? "center" : "start"}>
            <span style={{ textAlign: "justify", marginBottom: "16px" }}>
                {t("about:alertInfo")}
                <a
                    style={{
                        whiteSpace: "pre-wrap",
                        display: "inline",
                        color: colors.white,
                    }}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                >
                    {href}
                </a>
            </span>
            {localConfig.footer.showStatuteButton.show ? (<AletheiaButton
                type={ButtonType.whiteBlue}
                href={t("footer:statuteUrlButton")}
                target="_blank"
                rel="noreferrer"
            >
                <>
                    {t("about:labelButton")} <FileTextOutlined />
                </>
            </AletheiaButton>) : null}
        </Row>
    );
};

export default FooterInfo;
