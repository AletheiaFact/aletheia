import ArrowOutwardRounded from "@mui/icons-material/ArrowOutwardRounded";
import { Link, Stack } from "@mui/material";
import React from "react";
import { useFooterData } from "../hooks/useFooterData";

const FooterCtaActions = () => {
    const { t } = useFooterData();
    const callToActionRedirect = t("footer:cta.callToActionRedirect")

    return (
        <Stack
            direction="row"
            spacing={1.5}
            className="footer-cta-actions"
        >
            <Link
                href="/about"
                underline="none"
                className="footer-primary-cta-link"
            >
                {t("footer:cta.primaryButton")} <ArrowOutwardRounded sx={{ fontSize: 18 }} />
            </Link>
            <Link
                href={callToActionRedirect}
                underline="none"
                target="_blank"
                rel="noreferrer"
                className="footer-secondary-cta-link"
            >
                {t("footer:cta.secondaryButton")}
            </Link>
        </Stack>
    );
};

export default FooterCtaActions;
