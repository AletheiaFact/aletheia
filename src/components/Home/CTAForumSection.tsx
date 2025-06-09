import { useTranslation } from "next-i18next";
import React from "react";
import colors from "../../styles/colors";
import { NameSpaceEnum } from "../../types/Namespace";
import { useAtom } from "jotai";
import { currentNameSpace } from "../../atoms/namespace";
import CTARegistrationStyle from "./CTARegistration.style";
import CTAButton from "./CTAButton";

function CTAForumSection() {
    const { t } = useTranslation();
    const [nameSpace] = useAtom(currentNameSpace);

    return (
        <CTARegistrationStyle
            style={{
                backgroundColor:
                    nameSpace === NameSpaceEnum.Main
                        ? colors.primary
                        : colors.secondary,
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
                {t("home:visitForum")}
            </p>
            <p
                style={{
                    color: "rgba(255, 255, 255, 0.8)",
                    padding: "0 16px 0 16px",
                    fontSize: "16px",
                    fontWeight: 700,
                    lineHeight: "24px",
                    margin: "32px 0 13px 0",

                }}
            >
                {t("home:forumTitle")}
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
                {t("home:forumDescription")}
            </p>
            <CTAButton
                isLoggedIn={true}
            />
        </CTARegistrationStyle>
    )
}

export default CTAForumSection;