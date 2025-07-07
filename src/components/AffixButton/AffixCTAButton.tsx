import React, { useEffect, useState } from "react";
import { CloseOutlined, HelpOutlineOutlined } from "@mui/icons-material";
import Fab from "../AffixButton/Fab";
import { AletheiaModal } from "../Modal/AletheiaModal.style";
import Banner from "../SentenceReport/Banner";
import { useTranslation } from "next-i18next";
import Cookies from "js-cookie";
import CtaAnimation from "../CtaAnimation";
import InfoTooltip from "../Claim/InfoTooltip";
import colors from "../../styles/colors";
import { trackUmamiEvent } from "../../lib/umami";
import { useAppSelector } from "../../store/store";

const CloseIcon = () => {
    const { t } = useTranslation();
    return (
        <InfoTooltip
            children={
                <CloseOutlined style={{ margin: "10px", color: colors.white, position: "absolute", top: 5, right: 5 }} />
            }
            content={
                <span style={{ color: colors.black, fontSize: 15 }}>
                    {t("affix:AffixCloseTooltip")}
                </span>
            }
        />
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
                onCancel={() => setModalVisible(false)}
                theme="dark"
                width={vw?.xs ? "100%" : "60%"}
                closeIcon={<CloseIcon />}
                style={{ alignSelf: "flex-start", paddingTop: "10vh" }}
                title={
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <h2
                            style={{
                                color: colors.white,
                                fontFamily: "open sans, sans-serif",
                                fontWeight: 700,
                                fontSize: 14,
                                textAlign: "center",
                                textTransform: "uppercase",
                                padding: "0 30px",
                            }}
                        >
                            {t("NewCTAFolder:body")}
                        </h2>
                    </div>
                }
            >
                <Banner />
            </AletheiaModal>
        </>
    );
};

export default AffixCTAButton;
