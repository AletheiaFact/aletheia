/* eslint-disable @next/next/no-img-element */
import { Col, Layout, Row } from "antd";
import { useTranslation } from "next-i18next";
import React, { useLayoutEffect, useState } from "react";

import { useAppSelector } from "../../store/store";
import colors from "../../styles/colors";
import AletheiaSocialMediaFooter from "./AletheiaSocialMediaFooter";
import FooterInfo from "./FooterInfo";
import AletheiaInfo from "./AletheiaInfo";
import { NameSpaceEnum } from "../../types/Namespace";
import { useAtom } from "jotai";
import { currentNameSpace } from "../../atoms/namespace";

const Footer = () => {
    const { t } = useTranslation();
    const { vw } = useAppSelector((state) => state);
    const [nameSpace] = useAtom(currentNameSpace);
    const [backgroundColor, setBackgroundColor] = useState(colors.primary);

    useLayoutEffect(() => {
        setBackgroundColor(
            nameSpace === NameSpaceEnum.Main ? colors.primary : colors.secondary
        );
    }, [nameSpace]);

    return (
        <Layout.Footer
            style={{
                textAlign: "center",
                background: backgroundColor,
                color: colors.white,
                padding: "32px",
            }}
        >
            <Row gutter={24} justify="center">
                <Col lg={8} md={10} sm={24}>
                    <AletheiaSocialMediaFooter />

                    <Row
                        style={{
                            marginTop: "10px",
                            width: "100%",
                            textAlign: "center",
                            flexDirection: "column",
                            marginBottom: vw?.sm ? "32px" : "0",
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
                    lg={8}
                    md={10}
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
                                marginTop: vw?.sm ? "64px" : "0",
                                textAlign: "center",
                            }}
                        >
                            {t("footer:copyright", {
                                date: new Date().getFullYear(),
                            })}
                        </h3>
                    </Row>
                </Col>
                <Col
                    lg={8}
                    md={10}
                    sm={24}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <AletheiaInfo />
                </Col>
            </Row>
        </Layout.Footer>
    );
};

export default Footer;
