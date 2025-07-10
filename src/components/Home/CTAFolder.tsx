import { useTranslation } from "next-i18next";
import React from "react";
import CTAFolderStyle from "./CTAFolder.style";
import colors from "../../styles/colors";
import CTAButton from "./CTAButton";
import { ButtonType } from "../Button";
import { NameSpaceEnum } from "../../types/Namespace";
import { useAtom } from "jotai";
import { currentNameSpace } from "../../atoms/namespace";
import { isUserLoggedIn } from "../../atoms/currentUser";
import localConfig from "../../../config/localConfig";

function CTAFolder() {
    const { t } = useTranslation();
    const [nameSpace] = useAtom(currentNameSpace);
    const [isLoggedIn] = useAtom(isUserLoggedIn);

    return (
        localConfig.home.folderRedirectForum && (
            <CTAFolderStyle
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
                    {!isLoggedIn ? t("CTAFolder:title") : t("home:visitForum")}
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
                    {!isLoggedIn ? t("CTAFolder:body") : t("home:forumTitle")}
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
                    {!isLoggedIn ? t("CTAFolder:footer") : t("home:forumDescription")}
                </p>
                {localConfig.home.folderRedirectForum.ctaButton &&
                    <CTAButton
                        location="folder"
                        isLoggedIn={isLoggedIn}
                        type={ButtonType.white}
                        textWhenLoggedOut={t("CTAFolder:button")} />
                }

            </CTAFolderStyle>
        )
    );
}


export default CTAFolder;
