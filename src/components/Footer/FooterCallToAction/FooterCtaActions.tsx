import ArrowOutwardRounded from "@mui/icons-material/ArrowOutwardRounded";
import { Link, Stack } from "@mui/material";
import React from "react";
import { useFooterData } from "../hooks/useFooterData";
import { trackUmamiEvent } from "../../../lib/umami";

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
                data-cy="testFooterCtaPrimaryLink"
            >
                {t("footer:cta.primaryButton")}
            </Link>
            <Link
                onClick={() => trackUmamiEvent("cta-footer-forum-form-button", "forumForm")}
                href={callToActionRedirect}
                underline="none"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-secondary-cta-link"
                data-cy="testFooterCtaSecondaryLink"
            >
                {t("footer:cta.secondaryButton")} <ArrowOutwardRounded sx={{ fontSize: 18 }} />
            </Link>
        </Stack>
    );
};

export default FooterCtaActions;
