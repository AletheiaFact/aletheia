import React from "react";
import { Box } from "@mui/material";
import FooterCta from "./FooterCallToAction/FooterCta";
import FooterMainContent from "./FooterMainContent/FooterMainContent";
import FooterLegal from "./FooterLegal";
import FooterBox from "./Footer.style";
import { useFooterData } from "./hooks/useFooterData";

const Footer = () => {
    const { mediumDevice, isMobile, isNameSpaceColor } = useFooterData();

    return (
        <FooterBox
            component="footer"
            $isMobile={isMobile}
            $namespacePrefix={isNameSpaceColor}
            $mediumDevice={mediumDevice}
        >
            <Box className="footer-inner-container">
                <FooterCta />

                <FooterMainContent />

                <FooterLegal />
            </Box>
        </FooterBox>
    );
};

export default Footer;
