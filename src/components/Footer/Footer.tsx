import React from "react";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import FooterCta from "./FooterCallToAction/FooterCta";
import FooterMainContent from "./FooterMainContent/FooterMainContent";
import FooterLegal from "./FooterLegal";
import FooterBox from "./Footer.style";
import { useFooterData } from "./hooks/useFooterData";
import localConfig from "../../../config/localConfig";

const Footer = () => {
    const { isMobile, isMainNamespace } = useFooterData();
    const router = useRouter();
    const showFooterCta =
        localConfig.footer.showCallToAction &&
        router.pathname !== "/committee-invitation-page";

    return (
        <FooterBox
            component="footer"
            $isMobile={isMobile}
            $namespacePrefix={isMainNamespace}
        >
            <Box className="footer-inner-container">
                {showFooterCta ? <FooterCta /> : null}

                <FooterMainContent />

                <FooterLegal />
            </Box>
        </FooterBox>
    );
};

export default Footer;
