import React, { useState } from "react";
import AletheiaButton, { ButtonType } from "../Button";
import { useTranslation } from "next-i18next";
import { AletheiaModal } from "../Modal/AletheiaModal.style";
import colors from "../../styles/colors";

const ForumButton = ({ style }) => {
    const { t } = useTranslation();
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleHideModal = () => {
        setIsModalVisible(false);
    };

    const handleClick = () => {
        setIsModalVisible(true);
    };

    return (
        <>
            <AletheiaButton
                type={ButtonType.white}
                onClick={handleClick}
                style={{
                    fontWeight: 600,
                    height: 40,
                    lineHeight: "16px",
                    textAlign: "center",
                    justifyContent: "center",
                    marginRight: "20px",
                    minWidth: "fit-content",
                    padding: "15px 10px 10px 0",
                    ...style,
                }}
            >
                {t("home:forumButton")}
            </AletheiaButton>

            <AletheiaModal
                open={isModalVisible}
                onCancel={handleHideModal}
                title={
                    <h2
                        style={{
                            fontFamily: "open sans, sans-serif",
                            fontWeight: 700,
                            fontSize: 14,
                            textAlign: "center",
                            textTransform: "uppercase",
                            padding: "0 34px"
                        }}>
                        Você será redirecionado para nosso fórum.
                    </h2>
                }
            >
                <p
                    style={{
                        fontWeight: 600,
                        width: "100%",
                        textAlign: "center",
                        color: colors.blackSecondary,
                    }}
                >
                    Para participar das discussões, use a mesma conta da Aletheia para fazer login por lá, clicando em entrar no canto superior da tela e fazer login com OpenID Connect.
                </p>

                <div
                    style={{
                        marginTop: 24,
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                    }}
                >
                    <AletheiaButton
                        type={ButtonType.blue}
                        onClick={handleHideModal}
                        href={"https://forum.aletheiafact.org/"}
                        data-cy={"testButtonTutorialOk"}
                    >
                        {t("tutorial:okButton")}
                    </AletheiaButton>
                </div>
            </AletheiaModal>
        </>
    );
};

export default ForumButton;
