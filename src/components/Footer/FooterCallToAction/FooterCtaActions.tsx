import ArrowOutwardRounded from "@mui/icons-material/ArrowOutwardRounded";
import { Link, Stack } from "@mui/material";
import React from "react";
import { useFooterData } from "../hooks/useFooterData";
import { trackUmamiEvent } from "../../../lib/umami";

const FooterCtaActions = () => {
    const { t } = useFooterData();

    return (
        <Stack direction="row" spacing={1.5} className="footer-cta-actions">
            <Link
                onClick={() =>
                    trackUmamiEvent(
                        "cta-footer-committee-invitation-button",
                        "committee-invitation"
                    )
                }
                href="https://forms.gle/AnTuCzXtPTrsXHGVA"
                target="_blank"
                rel="noopener noreferrer"
                underline="none"
                className="footer-primary-cta-link"
                data-cy="testFooterCtaPrimaryLink"
            >
                {t("footer:cta.primaryButton")}{" "}
                <ArrowOutwardRounded sx={{ fontSize: 18 }} />
            </Link>
            <Link
                onClick={() =>
                    trackUmamiEvent(
                        "cta-footer-committee-button",
                        "committee-invitation"
                    )
                }
                href="/committee-invitation"
                underline="none"
                className="footer-secondary-cta-link"
                data-cy="testFooterCtaSecondaryLink"
            >
                {t("footer:cta.secondaryButton")}
            </Link>
        </Stack>
    );
};

export default FooterCtaActions;
