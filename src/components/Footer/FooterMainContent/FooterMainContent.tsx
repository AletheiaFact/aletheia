import { FacebookOutlined, GitHub, Instagram, LinkedIn } from "@mui/icons-material";
import { Grid } from "@mui/material";
import React from "react";
import FooterBrandColumn from "./FooterBrandColumn";
import FooterLinksColumn from "./FooterLinksColumn";
import { FooterLink, FooterSocialLink } from "../../../types/Footer";
import FooterContactColumn from "./FooterContactColumn";
import { useFooterData } from "../hooks/useFooterData";

const FooterMainContent = () => {
    const { t, isMobile, namespacePrefix, statuteUrl } = useFooterData();


    const platformLinks: FooterLink[] = [
        { label: t("footer:sections.platform.links.access"), href: `${namespacePrefix}/verification-request` },
        { label: t("footer:sections.platform.links.manual"), href: "/supportive-materials" },
        { label: t("footer:sections.platform.links.docs"), href: "https://docs.aletheiafact.org", external: true },
        { label: t("footer:sections.platform.links.kit"), href: "/supportive-materials" },
    ];

    const institutionalLinks: FooterLink[] = [
        { label: t("footer:sections.institutional.links.about"), href: "/about" },
        { label: t("footer:sections.institutional.links.statute"), href: statuteUrl, external: true },
        { label: t("footer:sections.institutional.links.partners"), href: "/about#partners-section" },
        { label: t("footer:sections.institutional.links.awards"), href: "/about#awards-section" },
    ];

    const communityLinks: FooterLink[] = [
        { label: t("footer:sections.community.links.collaboration"), href: "mailto:contact@aletheiafact.org" },
        { label: t("footer:sections.community.links.training"), href: "mailto:contact@aletheiafact.org" },
        { label: t("footer:sections.community.links.universities"), href: "/about#partners-section" },
        { label: t("footer:sections.community.links.volunteering"), href: "mailto:contact@aletheiafact.org" },
    ];

    const socialLinks: FooterSocialLink[] = [
        { href: "https://www.instagram.com/aletheiafact", Icon: Instagram, label: "Instagram" },
        { href: "https://www.facebook.com/AletheiaFactorg-107521791638412", Icon: FacebookOutlined, label: "Facebook" },
        { href: "https://www.linkedin.com/company/aletheiafact-org", Icon: LinkedIn, label: "LinkedIn" },
        { href: "https://github.com/AletheiaFact/aletheia", Icon: GitHub, label: "GitHub" },
    ];

    return (
        <Grid
            container
            spacing={isMobile ? 5 : 3}
            className="footer-main-grid"
        >
            <FooterBrandColumn socialLinks={socialLinks} />

            {[
                { title: t("footer:sections.platform.title"), links: platformLinks },
                { title: t("footer:sections.institutional.title"), links: institutionalLinks },
                { title: t("footer:sections.community.title"), links: communityLinks },
            ].map((section) => (
                <FooterLinksColumn
                    key={section.title}
                    title={section.title}
                    links={section.links}
                />
            ))}

            <FooterContactColumn
                statuteUrl={statuteUrl}
            />
        </Grid>
    );
};

export default FooterMainContent;
