import { useTranslation } from "next-i18next";
import colors from "../styles/colors";
import React from "react";
import { Row } from "antd";
import Logo from "./Header/Logo";
import CTARegistration from "./Home/CTARegistration";
import Button, { ButtonType } from "./Button";
import AletheiaSocialMediaFooter from "./AletheiaSocialMediaFooter";

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
                        <Button type={ButtonType.blue} href="/about">{t("landingPage:learnMoreButton")}</Button>
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
            <AletheiaSocialMediaFooter />
        </main>
    );
};

export default LandingPageComponent;
