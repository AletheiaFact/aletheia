import React from "react";
import { Col, Row, Typography } from "antd";
import { useTranslation } from "next-i18next";
import colors from "../../styles/colors";
import SocialMediaShare from "../SocialMediaShare";
import SentenceReportCard from "./SentenceReportCard";
import NewCTARegistration from "./NewCTARegistration";
import { LinkPreview } from "@dhaiwat10/react-link-preview";
import Link from "next/link";
import AletheiaButton, { ButtonType } from "../Button";
import CTARegistration from "../Home/CTARegistration";
import styled from "styled-components";

const SentenceReportView = ({
    personality,
    claim,
    sentence,
    href,
    context,
}) => {
    const { t } = useTranslation();
    const { Title, Paragraph } = Typography;
    const summary = context.summary;
    const questions = context.questions;
    const report = context.report;
    const verification = context.verification;
    const sources = context.sources;
    const paragraphStyle = {
        margin: "10px 0px",
        width: "100%",
        fontWeight: 400,
        fontSize: "18px",
        lineHeight: "30px",
    };

    const CardStyle1 = styled.div`
        .sentence-report-card {
            padding-right: 20px;
        }

        @media (max-width: 1280px) {
            .sentence-report-card {
                padding-right: 25px;
                padding-left: 20px
            }
        }

        @media (max-width: 720px) {
            .sentence-report-card {
                padding-right: 0px;
                padding-left: 0px
            }
        }
    `;

    return (
        <CardStyle1>
            <Row className="main-content">
                <Col offset={3} span={18}>
                    <Row style={{ borderBottom: "1px solid #dfdfdf" }}>
                        <Col
                            md={{ order: 1, span: 16 }}
                            sm={{ order: 2, span: 24 }}
                            xs={{ order: 2, span: 24 }}
                            className="sentence-report-card"
                        >
                            <SentenceReportCard
                                personality={personality}
                                claim={claim}
                                sentence={sentence}
                                date={claim?.date}
                                claimType={claim?.type}
                                context={context}
                            />
                        </Col>
                        <Col
                            md={{ order: 2, span: 8 }}
                            sm={{ order: 1, span: 24 }}
                            xs={{ order: 1, span: 24 }}
                        >
                            <NewCTARegistration />
                        </Col>
                    </Row>
                    <Row>
                        <Col
                            span={24}
                            style={{
                                marginTop: "33px",
                                borderBottom: "1px solid #dfdfdf",
                            }}
                        >
                            <Typography.Title level={3}>
                                {t("claimReview:firstParagraphTittle")}
                            </Typography.Title>
                            <Paragraph style={paragraphStyle}>
                                {summary}
                            </Paragraph>
                        </Col>
                    </Row>
                    <Row>
                        <Col
                            span={24}
                            style={{
                                marginTop: "33px",
                                borderBottom: "1px solid #dfdfdf",
                            }}
                        >
                            <Typography.Title level={3}>
                                {t("claimReview:secondParagraphTittle")}
                            </Typography.Title>
                            {questions.map((item) => {
                                return (
                                    <li key={item} style={paragraphStyle}>
                                        {item}
                                    </li>
                                );
                            })}
                        </Col>
                        <Col
                            span={24}
                            style={{
                                marginTop: "33px",
                                borderBottom: "1px solid #dfdfdf",
                            }}
                        >
                            <Typography.Title level={3}>
                                {t("claimReview:thirdParagraphTittle")}
                            </Typography.Title>
                            <Paragraph style={paragraphStyle}>
                                {report}
                            </Paragraph>
                        </Col>
                        <Col
                            span={24}
                            style={{
                                marginTop: "33px",
                                borderBottom: "1px solid #dfdfdf",
                            }}
                        >
                            <Typography.Title level={3}>
                                {t("claimReview:fourthParagraphTittle")}
                            </Typography.Title>
                            <Paragraph style={paragraphStyle}>
                                {verification}
                            </Paragraph>
                        </Col>
                    </Row>
                    <Col style={{ marginTop: "33px" }}>
                        <Row
                            style={{
                                display: "inline-flex",
                                flexWrap: "wrap",
                                gap: "38px 38px",
                                width: "100%",
                            }}
                        >
                            <Typography.Title
                                style={{ width: "100%" }}
                                level={3}
                            >
                                {t("claim:sourceSectionTitle")}
                            </Typography.Title>
                            {sources && (
                                <>
                                    {sources.slice(0, 6).map((link) => {
                                        return (
                                            <Col
                                                key={link}
                                                style={{
                                                    display: "block",
                                                    flex: "1 1 30%",
                                                }}
                                            >
                                                <LinkPreview
                                                    url={link}
                                                    borderRadius="10px"
                                                    backgroundColor={
                                                        colors.lightGray
                                                    }
                                                    borderColor="transparent"
                                                    imageHeight="156px"
                                                    height={244}
                                                    secondaryTextColor="#515151"
                                                    fallback={
                                                        <Link href={link}>
                                                            {link}
                                                        </Link>
                                                    }
                                                    width="100%"
                                                />
                                                <Paragraph
                                                    style={{
                                                        fontSize: "10px",
                                                        width: "100%",
                                                        display: "flex",
                                                        justifyContent:
                                                            "center",
                                                        lineHeight: "15px",
                                                        color: colors.bluePrimary,
                                                    }}
                                                >
                                                    <p
                                                        style={{
                                                            marginBottom: 0,
                                                            marginRight: 3,
                                                        }}
                                                    >
                                                        {t(
                                                            "claim:sourceFooter2"
                                                        )}
                                                    </p>
                                                    <a
                                                        href={`mailto:${t(
                                                            "common:supportEmail"
                                                        )}`}
                                                        style={{
                                                            color: colors.blueSecondary,
                                                        }}
                                                    >
                                                        {" "}
                                                        {t(
                                                            "claim:sourceFooterReport"
                                                        )}
                                                    </a>
                                                </Paragraph>
                                            </Col>
                                        );
                                    })}
                                </>
                            )}
                            {sources?.length > 5 && (
                                <AletheiaButton
                                    style={{
                                        width: "100%",
                                        marginTop: "21px",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        paddingBottom: 0,
                                        marginBottom: "10px",
                                    }}
                                    type={ButtonType.blue}
                                    href={`/personality/${personality.slug}/claim/${claim.slug}/sources`}
                                >
                                    <Title
                                        level={4}
                                        style={{
                                            fontSize: 14,
                                            color: colors.white,
                                            fontWeight: 400,
                                            margin: 0,
                                        }}
                                    >
                                        {t("claim:seeSourcesButton")}
                                    </Title>
                                </AletheiaButton>
                            )}
                        </Row>
                    </Col>
                    <CTARegistration></CTARegistration>
                </Col>
                <Col span={24}>
                    <SocialMediaShare
                        isLoggedIn={"isLoggedIn"}
                        quote={personality?.name}
                        href={href}
                        claim={claim?.title}
                    />
                </Col>
            </Row>
        </CardStyle1>
    );
};

export default SentenceReportView;
