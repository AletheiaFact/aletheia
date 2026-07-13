import { FacebookOutlined, GitHub, Instagram, LinkedIn } from "@mui/icons-material";
import { Grid } from "@mui/material";
import React from "react";
import FooterBrandColumn from "./FooterBrandColumn";
import FooterLinksColumn from "./FooterLinksColumn";
import { FooterLink, FooterSocialLink } from "../../../types/Footer";
import FooterContactColumn from "./FooterContactColumn";
import { useFooterData } from "../hooks/useFooterData";

const FooterMainContent = () => {
    const { tFooter, isMobile, namespacePrefix, statuteUrl } = useFooterData();


    const platformLinks: FooterLink[] = [
        {
            label: tFooter("sections.platform.links.access"),
            href: `${namespacePrefix}`,
            dataCy: "testFooterLinkPlatformAccess"
        },
        {
            label: tFooter("sections.platform.links.manual"),
            href: tFooter("sections.platform.links.manualUrl"), external: true,
            dataCy: "testFooterLinkPlatformManual"
        },
        {
            label: tFooter("sections.platform.links.docs"),
            href: "https://docs.aletheiafact.org", external: true,
            dataCy: "testFooterLinkPlatformDocs"
        }
    ];

    const institutionalLinks: FooterLink[] = [
        {
            label: tFooter("sections.institutional.links.about"),
            href: "/about",
            dataCy: "testFooterLinkInstitutionalAbout"
        },
        {
            label: tFooter("sections.institutional.links.partners"),
            href: "/about#partners-section",
            dataCy: "testFooterLinkInstitutionalPartners"
        },
        {
            label: tFooter("sections.institutional.links.awards"),
            href: "/about#awards-section",
            dataCy: "testFooterLinkInstitutionalAwards"
        },
    ];

    const communityLinks: FooterLink[] = [
        {
            label: tFooter("sections.community.links.collaboration"),
            href: tFooter("sections.community.links.sendEmailCollaborationButton"),
            dataCy: "testFooterLinkCommunityCollaboration",
        },
        {
            label: tFooter("sections.community.links.universities"),
            href: "/about#partners-section",
            dataCy: "testFooterLinkCommunityUniversities",
        },
        {
            label: tFooter("sections.community.links.volunteering"),
            href: tFooter("sections.community.links.volunteerForm"),
            dataCy: "testFooterLinkCommunityVolunteering",
        },
    ];

    const socialLinks: FooterSocialLink[] = [
        {
            href: tFooter("instagram"),
            Icon: Instagram, label: "Instagram",
            dataCy: "testFooterSocialInstagram"
        },
        {
            href: tFooter("facebook"),
            Icon: FacebookOutlined, label: "Facebook",
            dataCy: "testFooterSocialFacebook"
        },
        {
            href: tFooter("linkedin"),
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
                { title: tFooter("sections.platform.title"), links: platformLinks },
                { title: tFooter("sections.institutional.title"), links: institutionalLinks },
                { title: tFooter("sections.community.title"), links: communityLinks },
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
