import {useTranslation} from "next-i18next";
import colors from "../styles/colors";
import {SocialIcon} from "react-social-icons";
import React from "react";
import {Row} from "antd";
import Logo from "./Header/Logo";
import CTARegistration from "./Home/CTARegistration";
import About from "./About/About";
import Button from "./Button";

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
                <Row
                    style={{
                        width: "100%",
                        marginBottom: "20px"
                    }}
                >
                    <Logo

                        color="white"
                    />
                </Row>
                <Row
                    style={{
                        color: colors.bluePrimary,
                        backgroundColor: colors.white,
                        justifyContent: "center",
                        width: "100%",
                        fontSize: "1rem",
                        letterSpacing: "1px",
                        fontWeight: 500,
                        padding: "20px"
                    }}
                >
                    <Row
                        style={{
                            justifyContent: "center",
                            textAlign: "center",
                            width: "100%",
                            fontSize: "1rem",
                            letterSpacing: "1px",
                            fontWeight: 500,
                            padding: "5px 20px",
                            marginBottom: "10px"
                        }}
                    >
                        {t("landingPage:description")}
                    </Row>
                    <Row
                        style={{
                            justifyContent: "center",
                            width: "100%",
                            fontSize: "1rem",
                            letterSpacing: "1px",
                            fontWeight: 500,
                            padding: "5px 20px"
                        }}
                    >
                        <Button type="blue" href="/about">{t("landingPage:learnMoreButton")}</Button>
                    </Row>


                </Row>
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
                    padding: "35px 10% 20px 10%",
                }}
            >
                <SocialIcon url="https://www.facebook.com/AletheiaFactorg-107521791638412" bgColor={colors.white} />
                <SocialIcon url="https://www.instagram.com/aletheiafact" bgColor={colors.white} />
                <SocialIcon url="https://www.linkedin.com/in/aletheiafact-org" bgColor={colors.white} />
                <SocialIcon url="https://www.github.com/in/aletheiafact" bgColor={colors.white} />
            </Row>
        </main>
    );
};

export default LandingPageComponent;
