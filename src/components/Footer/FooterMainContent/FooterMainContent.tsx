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
        {
            label: t("footer:sections.platform.links.access"),
            href: `${namespacePrefix}`,
            dataCy: "testFooterLinkPlatformAccess"
        },
        {
            label: t("footer:sections.platform.links.manual"),
            href: t("footer:sections.platform.links.manualUrl"), external: true,
            dataCy: "testFooterLinkPlatformManual"
        },
        {
            label: t("footer:sections.platform.links.docs"),
            href: "https://docs.aletheiafact.org", external: true,
            dataCy: "testFooterLinkPlatformDocs"
        }
    ];

    const institutionalLinks: FooterLink[] = [
        {
            label: t("footer:sections.institutional.links.about"),
            href: "/about",
            dataCy: "testFooterLinkInstitutionalAbout"
        },
        {
            label: t("footer:sections.institutional.links.partners"),
            href: "/about#partners-section",
            dataCy: "testFooterLinkInstitutionalPartners"
        },
        {
            label: t("footer:sections.institutional.links.awards"),
            href: "/about#awards-section",
            dataCy: "testFooterLinkInstitutionalAwards"
        },
    ];

    const communityLinks: FooterLink[] = [
        {
            label: t("footer:sections.community.links.collaboration"),
            href: t("footer:sections.community.links.sendEmailCollaborationButton"),
            dataCy: "testFooterLinkCommunityCollaboration",
        },
        {
            label: t("footer:sections.community.links.training"),
            href: t("footer:sections.community.links.sendEmailButton"),
            dataCy: "testFooterLinkCommunityTraining",
        },
        {
            label: t("footer:sections.community.links.universities"),
            href: "/about#partners-section",
            dataCy: "testFooterLinkCommunityUniversities",
        },
        {
            label: t("footer:sections.community.links.volunteering"),
            href: t("footer:sections.community.links.sendEmailButton"),
            dataCy: "testFooterLinkCommunityVolunteering",
        },
    ];

    const socialLinks: FooterSocialLink[] = [
        {
            href: t("footer:instagram"),
            Icon: Instagram, label: "Instagram",
            dataCy: "testFooterSocialInstagram"
        },
        {
            href: t("footer:facebook"),
            Icon: FacebookOutlined, label: "Facebook",
            dataCy: "testFooterSocialFacebook"
        },
        {
            href: t("footer:linkedin"),
            Icon: LinkedIn, label: "LinkedIn",
            dataCy: "testFooterSocialLinkedIn"
        },
        {
            href: "https://github.com/AletheiaFact/aletheia",
            Icon: GitHub, label: "GitHub",
            dataCy: "testFooterSocialGithub"
        },
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
