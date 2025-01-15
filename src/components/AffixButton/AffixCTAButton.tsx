import React, { useEffect, useState } from "react";
import { CloseOutlined, HelpOutlineOutlined } from "@mui/icons-material";
import Fab from "../AffixButton/Fab";
import { AletheiaModal } from "../Modal/AletheiaModal.style";
import Banner from "../SentenceReport/Banner";
import { useTranslation } from "next-i18next";
import Cookies from "js-cookie";
import CtaAnimation from "../CtaAnimation";
import { Tooltip } from "antd";
import colors from "../../styles/colors";
import { trackUmamiEvent } from "../../lib/umami";
import { useAppSelector } from "../../store/store";

const CloseIcon = () => {
    const { t } = useTranslation();
    return (
        <Tooltip
            title={t("affix:AffixCloseTooltip")}
            placement="topRight"
            defaultOpen
            color={colors.white}
            overlayInnerStyle={{ color: colors.black }}
        >
            <CloseOutlined style={{margin:"10px", color:colors.white}} />
        </Tooltip>
    );
};

const AffixCTAButton = ({ copilotDrawerWidth }) => {
    const { t } = useTranslation();
    const { vw, copilotDrawerCollapsed } = useAppSelector((state) => ({
        vw: state?.vw,
        copilotDrawerCollapsed:
            state?.copilotDrawerCollapsed !== undefined
                ? state?.copilotDrawerCollapsed
                : true,
    }));
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [CTABannerShow, setCTABannerShow] = useState<boolean>(true);

    useEffect(() => {
        const CTABannerShow = Cookies.get("cta_banner_show") || true;
        if (CTABannerShow === true || CTABannerShow === "true") {
            return setCTABannerShow(true);
        }
        setCTABannerShow(false);
    }, []);

    const handleCTAClick = () => {
        trackUmamiEvent("affix-cta-button", "registration");
        setModalVisible(true);
        Cookies.set("cta_banner_show", "false");
        setCTABannerShow(false);
    };

    return (
        <>
            {CTABannerShow && (
                <div
                    style={{
                        position: "fixed",
                        top: "15%",
                        right:
                            copilotDrawerCollapsed || vw?.md
                                ? "0%"
                                : copilotDrawerWidth,
                        display: "flex",
                        flexDirection: "column-reverse",
                        alignItems: "center",
                        gap: "1rem",
                        zIndex: 999,
                    }}
                >
                    <CtaAnimation pulse={!CTABannerShow}>
                        <Fab
                            tooltipText={t("affix:affixCallToActionButton")}
                            size="60px"
                            onClick={handleCTAClick}
                            data-cy={"testCTAFloatButton"}
                            icon={
                                <HelpOutlineOutlined
                                    fontSize="medium"
                                />
                            }
                        />
                    </CtaAnimation>
                </div>
            )}

            <AletheiaModal
                open={modalVisible}
                footer={null}
                title={t("NewCTARegistration:body")}
                onCancel={() => setModalVisible(false)}
                maskClosable={false}
                theme="dark"
                width={"75%"}
                closeIcon={<CloseIcon />}
            >
                <Banner />
            </AletheiaModal>
        </>
    );
};

export default AffixCTAButton;
