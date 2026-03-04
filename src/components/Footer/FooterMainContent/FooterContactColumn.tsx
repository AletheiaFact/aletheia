import { ArrowOutwardRounded, Business, EmailOutlined, LocationOnOutlined } from "@mui/icons-material";
import { Box, Grid, Link, Stack, Typography } from "@mui/material";
import React from "react";
import { useFooterData } from "../hooks/useFooterData";
import localConfig from "../../../../config/localConfig";

type FooterContactColumnProps = {
    statuteUrl: string;
};

const FooterContactColumn = ({ statuteUrl }: FooterContactColumnProps) => {
    const { t } = useFooterData();

    return (
        <Grid item xs={12} md={2} lg={2}>
            <Typography className="footer-column-title">
                {t("footer:sections.contact.title")}
            </Typography>

            <Stack spacing={1.7}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <EmailOutlined className="footer-icon" />
                    <Typography className="footer-contact-text">
                        {t("footer:contactEmail")}
                    </Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="flex-start">
                    <LocationOnOutlined className="footer-icon" />
                    <Box>
                        <Typography className="footer-contact-text">
                            {t("footer:adressStreet")}
                        </Typography>
                    </Box>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Business className="footer-icon" />
                    <Typography className="footer-contact-text">
                        {t("footer:legalRegistration")}
                    </Typography>
                </Stack>
                {localConfig.footer.showStatuteButton.show ?
                    <Link
                        href={statuteUrl}
                        target="_blank"
                        rel="noreferrer"
                        underline="none"
                        className="footer-statute-link"
                        data-cy="testFooterStatuteLink"
                    >
                        {t("footer:sections.contact.statuteCta")} <ArrowOutwardRounded className="footer-statute-arrow" />
                    </Link>
                    : null}
            </Stack>
        </Grid>
    );
};

export default FooterContactColumn;
