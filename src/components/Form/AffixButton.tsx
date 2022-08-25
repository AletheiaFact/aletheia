import { PlusCircleFilled, PlusOutlined } from "@ant-design/icons";
import { Button, Tooltip } from "antd";
import Cookies from "js-cookie";
import { Trans, useTranslation } from "next-i18next";
import React, { useEffect, useState } from "react";

import colors from "../../styles/colors";
import AletheiaButton, { ButtonType } from "../Button";
import { AletheiaModal } from "../Modal/AletheiaModal.style";
import PulseAnimation from "../PulseAnimation";

const AffixButton = (props) => {
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        const tutorialShown = Cookies.get("tutorial_shown") || false;
        setIsModalVisible(!tutorialShown);
    }, []);

    const handleHideModal = () => {
        Cookies.set("tutorial_shown", true);
        setIsModalVisible(false);
    };
    const { t } = useTranslation();
    return (
        <>
            <PulseAnimation
                pulse={isModalVisible}
                startColor={colors.blueSecondary}
                endColor={colors.bluePrimary}
                startSize={0}
                endSize={65}
                style={{
                    width: "70px",
                    height: "70px",
                    position: "fixed",
                    bottom: "3%",
                    right: "2%",
                    zIndex: 9999,
                    borderRadius: "100%",
                }}
            >
                <Tooltip placement="left" title={props.tooltipTitle}>
                    <Button
                        style={{
                            background: colors.white,
                            color: colors.bluePrimary,
                            borderColor: colors.white,
                            boxShadow: "rgba(0, 0, 0, 0.35) 0px 8px 24px",
                            width: "70px",
                            height: "70px",
                        }}
                        size="large"
                        shape="circle"
                        href={props.href}
                        onClick={handleHideModal}
                        data-cy={"testButtonAddClaim"}
                        type="primary"
                        icon={
                            <PlusOutlined
                                style={{
                                    padding: "21px",
                                    fontSize: "27px",
                                    display: "block",
                                }}
                            />
                        }
                    />
                </Tooltip>
            </PulseAnimation>

            <AletheiaModal
                className="ant-modal-content"
                visible={isModalVisible}
                footer={false}
                onCancel={handleHideModal}
                centered
                title={t("tutorial:modalTitle")}
            >
                <p
                    style={{
                        fontWeight: 600,
                        width: "100%",
                        textAlign: "center",
                        color: colors.blackSecondary,
                    }}
                >
                    <Trans
                        i18nKey={"tutorial:modalContent"}
                        components={[<PlusCircleFilled />]}
                    />
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
                    >
                        {t("tutorial:okButton")}
                    </AletheiaButton>
                </div>
            </AletheiaModal>
        </>
    );
};

export default AffixButton;
