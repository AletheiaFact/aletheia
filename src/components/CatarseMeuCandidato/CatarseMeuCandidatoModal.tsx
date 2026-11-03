import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Trans, useTranslation } from "next-i18next";
import { IconButton } from "@mui/material";
import CloseOutlined from "@mui/icons-material/CloseOutlined";
import ConfirmationNumberOutlined from "@mui/icons-material/ConfirmationNumberOutlined";
import FlagOutlined from "@mui/icons-material/FlagOutlined";
import GavelOutlined from "@mui/icons-material/GavelOutlined";
import OpenInNewOutlined from "@mui/icons-material/OpenInNewOutlined";
import { trackUmamiEvent } from "../../lib/umami";
import CatarseMeuCandidatoStyle from "./CatarseMeuCandidato.style";

const CATARSE_COOKIE = "cta_catarse_meucandidato_show";
const CATARSE_COOKIE_EXPIRES_DAYS = 7;
const SHOW_DELAY_MS = 2500;

const CATARSE_URL =
    "https://www.catarse.com.br/meucandidato?utm_source=aletheiafact&utm_medium=popup&utm_campaign=meucandidato";

const dismiss = (onClose: () => void) => {
    onClose();
    Cookies.set(CATARSE_COOKIE, "false", {
        expires: CATARSE_COOKIE_EXPIRES_DAYS,
    });
};

/**
 * Site-wide pop-up promoting the "Meu Candidato" Catarse crowdfunding
 * campaign. Custom two-panel layout matching the approved design (dark
 * pitch panel + light "how it works" panel), rather than the shared
 * AletheiaModal wrapper, since the split-panel look needs full control
 * over the dialog paper.
 *
 * Gated by NEXT_PUBLIC_ENABLE_POPUP_MEUCANDIDATO, dismissible, and
 * re-shown 7 days after a dismissal (the campaign has a hard deadline,
 * so — unlike the donation banner — we don't want a "forever" dismiss).
 */
const CatarseMeuCandidatoModal = () => {
    const { t } = useTranslation();
    const enablePopup =
        process.env.NEXT_PUBLIC_ENABLE_POPUP_MEUCANDIDATO === "true";
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (!enablePopup) {
            return;
        }

        const alreadyDismissed = Cookies.get(CATARSE_COOKIE);
        if (alreadyDismissed) {
            return;
        }

        const timer = setTimeout(() => {
            setOpen(true);
            trackUmamiEvent("catarse-meucandidato-popup-shown", "popup");
        }, SHOW_DELAY_MS);

        return () => clearTimeout(timer);
    }, [enablePopup]);

    if (!enablePopup) {
        return null;
    }

    const handleClose = () => {
        trackUmamiEvent("catarse-meucandidato-popup-close", "popup");
        dismiss(() => setOpen(false));
    };

    const handleSupportClick = () => {
        trackUmamiEvent("catarse-meucandidato-popup-cta", "popup");
        dismiss(() => setOpen(false));
    };

    return (
        <CatarseMeuCandidatoStyle open={open} onClose={handleClose} maxWidth={false}>
            <div className="catarse-modal">
                <div className="catarse-panel catarse-panel--dark">
                    <span className="catarse-eyebrow">
                        {t("catarseMeuCandidato:eyebrow")}
                    </span>
                    <h2 className="catarse-headline">
                        {t("catarseMeuCandidato:headline")}
                    </h2>
                    <p className="catarse-description">
                        {t("catarseMeuCandidato:description")}
                    </p>
                    <blockquote className="catarse-quote">
                        {t("catarseMeuCandidato:quote")}
                    </blockquote>
                    <div className="catarse-badges">
                        <span className="catarse-badge">
                            {t("catarseMeuCandidato:badgeFree")}
                        </span>
                        <span className="catarse-badge">
                            {t("catarseMeuCandidato:badgeOpenSource")}
                        </span>
                        <span className="catarse-badge">
                            {t("catarseMeuCandidato:badgeNonPartisan")}
                        </span>
                    </div>
                </div>
                <div className="catarse-panel catarse-panel--light">
                    <IconButton
                        className="catarse-close"
                        size="small"
                        onClick={handleClose}
                        aria-label={t("catarseMeuCandidato:closeLabel")}
                    >
                        <CloseOutlined />
                    </IconButton>
                    <h3 className="catarse-panel-title">
                        {t("catarseMeuCandidato:howItWorksTitle")}
                    </h3>
                    <ul className="catarse-list">
                        <li>
                            <ConfirmationNumberOutlined />
                            <span>
                                <Trans i18nKey="catarseMeuCandidato:pointPledge" />
                            </span>
                        </li>
                        <li>
                            <FlagOutlined />
                            <span>{t("catarseMeuCandidato:pointGoal")}</span>
                        </li>
                        <li>
                            <GavelOutlined />
                            <span>{t("catarseMeuCandidato:pointIndependence")}</span>
                        </li>
                    </ul>
                    <a
                        className="catarse-cta"
                        href={CATARSE_URL}
                        target="_blank"
                        rel="noreferrer"
                        onClick={handleSupportClick}
                    >
                        {t("catarseMeuCandidato:yesButton")}
                        <OpenInNewOutlined fontSize="small" />
                    </a>
                    <button
                        type="button"
                        className="catarse-dismiss"
                        onClick={handleClose}
                    >
                        {t("catarseMeuCandidato:noButton")}
                    </button>
                </div>
            </div>
        </CatarseMeuCandidatoStyle>
    );
};

export default CatarseMeuCandidatoModal;
