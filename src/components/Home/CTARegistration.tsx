import { useTranslation } from "next-i18next";
import React from "react";
import CTARegistrationStyle from "./CTARegistration.style";
import colors from "../../styles/colors";
import CTAButton from "./CTAButton";
import { ButtonType } from "../Button";
import { NameSpaceEnum } from "../../types/Namespace";
import { useAtom } from "jotai";
import { currentNameSpace } from "../../atoms/namespace";
import localConfig from "../../../config/localConfig";

function CTARegistration() {
    const { t } = useTranslation();
    const [nameSpace] = useAtom(currentNameSpace);
    return (
        <CTARegistrationStyle
            style={{
                backgroundColor:
                    nameSpace === NameSpaceEnum.Main
                        ? colors.bluePrimary
                        : colors.blueSecondary,
                textAlign: "center",
                maxWidth: "100%",
                display: "grid",
                justifyContent: "center",
            }}
        >
            <p
                style={{
                    width: "100%",
                    color: colors.white,
                    fontSize: "22px",
                    lineHeight: "34px",
                    fontWeight: 800,
                    marginBottom: 0,
                }}
            >
                {t("CTARegistration:title")}
            </p>
            <p
                style={{
                    color: "rgba(255, 255, 255, 0.8)",
                    padding: "0 16px 0 16px",
                    fontSize: "16px",
                    fontWeight: 600,
                    lineHeight: "24px",
                    margin: "32px 0 13px 0",
                }}
            >
                {localConfig.home.ctaBanner.text ? localConfig.home.ctaBanner.text : t("CTARegistration:body")}
            </p>
            <p
                style={{
                    color: "rgba(255, 255, 255, 0.8)",
                    padding: "0 16px 0 16px",
                    fontSize: "14px",
                    fontWeight: 600,
                    lineHeight: "22px",
                    marginBottom: "32px",
                }}
            >
                {t("CTARegistration:footer")}
            </p>
            <CTAButton type={ButtonType.white} />
        </CTARegistrationStyle>
    );
}

export default CTARegistration;
