/* eslint-disable @next/next/no-img-element */
import { Row, Col, Layout } from "antd";
import { useTranslation } from "next-i18next";
import React from "react";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import colors from "../../styles/colors";
import AletheiaSocialMediaFooter from "./AletheiaSocialMediaFooter";
import FooterInfo from "./FooterInfo";

const Footer = () => {
    const { t } = useTranslation();
    const isMobile = useMediaQuery("(max-width: 767px)");
    return (
        <Layout.Footer
            style={{
                textAlign: "center",
                background: colors.bluePrimary,
                color: colors.white,
                padding: "32px",
            }}
        >
            <Row gutter={24} justify="center">
                <Col lg={9} md={12} sm={24}>
                    <AletheiaSocialMediaFooter />

                    <Row
                        style={{
                            marginTop: "10px",
                            width: "100%",
                            textAlign: "center",
                            flexDirection: "column",
                            marginBottom: isMobile ? "32px" : "0",
                        }}
                    >
                        <Col style={{ marginBottom: "16px" }}>
                            <a
                                rel="license noreferrer"
                                href="https://creativecommons.org/licenses/by-sa/4.0/"
                                target="_blank"
                            >
                                <img
                                    height={31}
                                    width={88}
                                    alt="Creative Commons License"
                                    src="https://i.creativecommons.org/l/by-sa/4.0/88x31.png"
                                />
                            </a>
                        </Col>

                        {t("footer:creativeCommons")}
                        <a
                            style={{
                                whiteSpace: "pre-wrap",
                                display: "inline-block",
                                color: "white",
                            }}
                            rel="license noreferrer"
                            href="https://creativecommons.org/licenses/by-sa/4.0/"
                            target="_blank"
                        >
                            Creative Commons Attribution-ShareAlike 4.0
                            International License
                        </a>
                    </Row>
                </Col>
                <Col
                    lg={9}
                    md={12}
                    sm={24}
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        flexDirection: "column",
                    }}
                >
                    <FooterInfo />
                    <Row>
                        <h3
                            style={{
                                width: "100%",
                                fontSize: "23px",
                                color: colors.white,
                                marginBottom: 0,
                                marginTop: isMobile ? "64px" : "0",
                                textAlign: isMobile ? "center" : "left",
                            }}
                        >
                            {t("footer:copyright")}
                        </h3>
                    </Row>
                </Col>
            </Row>
        </Layout.Footer>
    );
};

export default Footer;
