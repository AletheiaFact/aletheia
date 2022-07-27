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
import SentenceReportViewStyle from "./SentenceReportView.style";

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
        fontSize: "16px",
        lineHeight: "30px",
    };

    return (
        <SentenceReportViewStyle>
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
                            <Paragraph
                                style={{
                                    fontSize: "16px",
                                    lineHeight: "24px",
                                    fontWeight: 700,
                                    textTransform: "uppercase",
                                }}
                            >
                                {t("claimReview:firstParagraphTittle")}
                            </Paragraph>
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
                            <Paragraph
                                style={{
                                    fontSize: "16px",
                                    lineHeight: "24px",
                                    fontWeight: 700,
                                    textTransform: "uppercase",
                                }}
                            >
                                {t("claimReview:secondParagraphTittle")}
                            </Paragraph>
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
                            <Paragraph
                                style={{
                                    fontSize: "16px",
                                    lineHeight: "24px",
                                    fontWeight: 700,
                                    textTransform: "uppercase",
                                }}
                            >
                                {t("claimReview:thirdParagraphTittle")}
                            </Paragraph>
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
                            <Paragraph
                                style={{
                                    fontSize: "16px",
                                    lineHeight: "24px",
                                    fontWeight: 700,
                                    textTransform: "uppercase",
                                }}
                            >
                                {t("claimReview:fourthParagraphTittle")}
                            </Paragraph>
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
                            <Paragraph
                                style={{
                                    fontSize: "16px",
                                    lineHeight: "24px",
                                    fontWeight: 700,
                                    textTransform: "uppercase",
                                }}
                            >
                                {t("claim:sourceSectionTitle")}
                            </Paragraph>
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
                                                        colors.white
                                                    }
                                                    borderColor="rgba(177, 194, 205, 0.4)"
                                                    imageHeight="156px"
                                                    height={244}
                                                    secondaryTextColor={
                                                        colors.grayPrimary
                                                    }
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
                            {sources?.length > 6 && (
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
        </SentenceReportViewStyle>
    );
};

export default SentenceReportView;
