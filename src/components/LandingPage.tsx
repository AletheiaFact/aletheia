import {useTranslation} from "next-i18next";
import colors from "../styles/colors";
import {SocialIcon} from "react-social-icons";
import React from "react";
import {Row} from "antd";
import Logo from "./Header/Logo";
import CTARegistration from "./Home/CTARegistration";

const LandingPageComponent = () => {
    const { t } = useTranslation();

    return (
        <main
            className="container"
            style={{
                backgroundImage: `linear-gradient(to bottom, ${colors.bluePrimary}, ${colors.blueSecondary})`,
                minHeight: "100vh",
                paddingTop: "15%"
            }}
        >
            <Row style={{
                width: "100%",
                justifyContent: "center"
            }}>
                <Logo color="white" />
                <CTARegistration style={{
                    backgroundColor: "unset"
                }}
                />
            </Row>
            <Row
                style={{
                    color: colors.white,
                    justifyContent: "center",
                    width: "100%",
                    fontSize: "1rem",
                    letterSpacing: "1px",
                    fontWeight: 500,
                    padding: "5px 20px"
                }}
            >
                <div style={{
                    textAlign: "center"
                }}>
                    {t("landingPage:socialNetworksCTA")}
                </div>
            </Row>
            <Row
                style={{
                    display: "flex",
                    justifyContent: "space-evenly",
                    padding: "35px 25% 20px 25%",
                }}
            >
                <SocialIcon url="https://www.facebook.com/AletheiaFactorg-107521791638412" bgColor={colors.white} />
                <SocialIcon url="https://www.instagram.com/aletheiafact" bgColor={colors.white} />
            </Row>
        </main>
    );
};

export default LandingPageComponent;
