import { GitHub } from "@mui/icons-material";
import { Grid, Link, Stack, Typography, Box } from "@mui/material";
import { SocialIcon } from "react-social-icons";
import React from "react";
import { FooterSocialLink } from "../../../types/Footer";
import { useFooterData } from "../hooks/useFooterData";
import localConfig from "../../../../config/localConfig";
import colors from "../../../styles/colors";

type FooterBrandColumnProps = {
    socialLinks: FooterSocialLink[];
};

const FooterBrandColumn = ({ socialLinks }: FooterBrandColumnProps) => {
    const { t } = useFooterData();

    return (
        <Grid item xs={12} md={4} lg={4}>
            <Typography className="footer-brand-title">
                {t("footer:brand")}
            </Typography>
            <Typography className="footer-brand-description">
                {t("footer:description")}
            </Typography>

            <Stack direction="row" spacing={1} className="footer-social-stack">
                {
                    localConfig.footer.socialMedias.useCustomUrls
                        ? localConfig.footer.socialMedias.urls.map((url) => url! && (
                            <SocialIcon
                                key={url}
                                url={url}
                                bgColor={colors.primary}
                                target="_blank"
                                rel="noopener noreferrer"
                                fgColor="white"
                                className="footer-social-link"
                            />
                        ))
                        : socialLinks.map(({ href, Icon, label, dataCy }) => (
                            <Link
                                key={href}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={label}
                                className="footer-social-link"
                                data-cy={dataCy}
                            >
                                <Icon />
                            </Link>
                        ))
                }
            </Stack>

            <Box className="footer-open-source-pill">
                <GitHub className="footer-icon" />
                {t("footer:openSource")}
            </Box>
        </Grid >
    );
};

export default FooterBrandColumn;
