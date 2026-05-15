import React from "react";
import { Box } from "@mui/material";
import FooterCta from "./FooterCallToAction/FooterCta";
import FooterMainContent from "./FooterMainContent/FooterMainContent";
import FooterLegal from "./FooterLegal";
import FooterBox from "./Footer.style";
import { useFooterData } from "./hooks/useFooterData";
import localConfig from "../../../config/localConfig";

const Footer = () => {
    const { isMobile, isMainNamespace } = useFooterData();

    return (
        <FooterBox
            component="footer"
            $isMobile={isMobile}
            $namespacePrefix={isMainNamespace}
        >
            <Box className="footer-inner-container">
                {localConfig.footer.showCallToAction ? <FooterCta /> : null}

                <FooterMainContent />

                <FooterLegal />
            </Box>
        </FooterBox>
    );
};

export default Footer;
