import React from "react";
import { Col, Row, Typography } from "antd";
import { useTranslation } from "next-i18next";
import colors from "../../styles/colors";
import { LinkPreview } from "@dhaiwat10/react-link-preview";
import Link from "next/link";
import AletheiaButton, { ButtonType } from "../Button";

const { Title, Paragraph } = Typography;
const SentenceReportContent = ({ context, personality, claim }) => {
    const { t } = useTranslation();
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

    return (
        <>
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
                    <Paragraph style={paragraphStyle}>{summary}</Paragraph>
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
                    <Paragraph style={paragraphStyle}>{report}</Paragraph>
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
                    <Paragraph style={paragraphStyle}>{verification}</Paragraph>
                </Col>
                <Col
                    span={24}
                    style={{ marginTop: "33px", border: "1px solid red" }}
                >
                    <Row
                        style={{
                            display: "inline-flex",
                            flexWrap: "wrap",
                            gap: "38px 38px",
                            width: "100%",
                            border: "1px solid green",
                        }}
                    >
                        <Typography.Title style={{ width: "100%" }} level={3}>
                            {t("claim:sourceSectionTitle")}
                        </Typography.Title>
                        {sources &&
                            sources.slice(0, 6).map((link) => {
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
                                            backgroundColor={colors.white}
                                            borderColor="rgba(177, 194, 205, 0.4)"
                                            imageHeight="156px"
                                            height={244}
                                            secondaryTextColor={
                                                colors.grayPrimary
                                            }
                                            fallback={
                                                <Link href={link}>{link}</Link>
                                            }
                                            width="100%"
                                        />
                                        <Paragraph
                                            style={{
                                                fontSize: "10px",
                                                width: "100%",
                                                display: "flex",
                                                justifyContent: "center",
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
                                                {t("claim:sourceFooter2")}
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
                                                {t("claim:sourceFooterReport")}
                                            </a>
                                        </Paragraph>
                                    </Col>
                                );
                            })}
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
            </Row>
        </>
    );
};

export default SentenceReportContent;
