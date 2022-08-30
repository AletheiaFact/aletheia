import { Col, Row, Typography } from "antd";
import { useTranslation } from "next-i18next";
import React from "react";
import colors from "../../styles/colors";
import LocalizedDate from "../LocalizedDate";

const { Paragraph } = Typography;

const ClaimCardHeader = ({ personality, date, claimType = "speech" }) => {
    const { t } = useTranslation();
    const speechTypeTranslation =
        claimType.toLowerCase() === "speech"
            ? t("claim:typeSpeech")
            : t("claim:typeTwitter");
    return (
        <Col
            span={24}
            style={{
                color: colors.blackSecondary,
                width: "100%",
            }}
        >
            <Paragraph
                style={{
                    fontSize: "14px",
                    lineHeight: "20px",
                    fontWeight: 600,
                    marginBottom: 0,
                    color: colors.blackPrimary,
                }}
            >
                {personality.name}
            </Paragraph>

            <Row>
                <Paragraph
                    style={{
                        fontSize: 10,
                        fontWeight: 400,
                        lineHeight: "18px",
                        marginBottom: 0,
                    }}
                >
                    {personality.description}
                </Paragraph>
            </Row>

            <Row>
                <Paragraph
                    style={{
                        fontSize: 10,
                        fontWeight: 400,
                        lineHeight: "15px",
                        marginBottom: 0,
                        color: colors.blackSecondary,
                    }}
                >
                    {t("claim:cardHeader1")}&nbsp;
                    <LocalizedDate date={date} />
                    &nbsp;
                    {t("claim:cardHeader2")}&nbsp;
                    <span style={{ fontWeight: 700 }}>
                        {speechTypeTranslation}
                    </span>
                </Paragraph>
            </Row>
        </Col>
    );
};

export default ClaimCardHeader;
