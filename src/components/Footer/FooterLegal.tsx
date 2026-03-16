import { OpenInNewRounded } from "@mui/icons-material";
import { Link, Stack, Typography } from "@mui/material";
import React from "react";
import { useFooterData } from "./hooks/useFooterData";

const FooterLegal = () => {
    const { t } = useFooterData();

    return (
        <Stack
            direction="row"
            spacing={2}
            justifyContent="space-between"
            alignItems="center"
            className="footer-legal-container"
        >
            <Stack
                direction="row"
                spacing={2}
                alignItems="center"
            >
                <Typography className="footer-legal-text">
                    {t("footer:copyright", { date: new Date().getFullYear() })}
                </Typography>
                <Typography>|</Typography>
                <Typography className="footer-legal-text">
                    {t("footer:award")}
                </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
                <Link
                    href="https://creativecommons.org/licenses/by-sa/4.0/"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cy="testFooterCreativeCommonsLink"
                >
                    <OpenInNewRounded className="footer-icon" />
                </Link>
                <Typography className="footer-legal-text">
                    {t("footer:creativeCommonsLabel")}
                </Typography>
            </Stack>
        </Stack>
    );
};

export default FooterLegal;
