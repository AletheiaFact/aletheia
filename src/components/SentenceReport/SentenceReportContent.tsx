import { LinkPreview } from "@dhaiwat10/react-link-preview";
import { Col, Divider, List, Skeleton, Typography } from "antd";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import React from "react";

import colors from "../../styles/colors";
import AletheiaButton, { ButtonType } from "../Button";
import SentenceReportContentStyle from "./SentenceReportContent.style";

const { Title, Paragraph } = Typography;
const SentenceReportContent = ({ context, personality, claim }) => {
    const { t } = useTranslation();
    const { summary, questions, report, verification, sources } = context;

    return (
        <SentenceReportContentStyle>
            <Col span={24}>
                <Paragraph className="title">
                    {t("claimReview:summarySectionTitle")}
                </Paragraph>
                <Paragraph className="paragraph">{summary}</Paragraph>
                <Divider />
            </Col>
            {questions.length > 0 && (
                <Col span={24}>
                    <Paragraph className="title">
                        {t("claimReview:questionsSectionTitle")}
                    </Paragraph>
                    {questions.map((item) => {
                        return (
                            <li key={item} className="paragraph">
                                {item}
                            </li>
                        );
                    })}
                    <Divider />
                </Col>
            )}
            {report && (
                <Col span={24}>
                    <Paragraph className="title">
                        {t("claimReview:verificationSectionTitle")}
                    </Paragraph>
                    <Paragraph className="paragraph">{report}</Paragraph>
                    <Divider />
                </Col>
            )}
            {verification && (
                <Col span={24}>
                    <Paragraph className="title">
                        {t("claimReview:howSectionTitle")}
                    </Paragraph>
                    <Paragraph className="paragraph">{verification}</Paragraph>
                    <Divider />
                </Col>
            )}
            <Col span={24}>
                <Paragraph className="title">
                    {t("claim:sourceSectionTitle")}
                </Paragraph>

                {sources && (
                    <List
                        itemLayout="horizontal"
                        dataSource={sources.slice(0, 6)}
                        style={{ width: "100%" }}
                        grid={{
                            gutter: 38,
                            xs: 1,
                            sm: 2,
                            md: 3,
                            lg: 3,
                            xl: 3,
                            xxl: 3,
                        }}
                        renderItem={(link: any) => {
                            return (
                                <Col className="source">
                                    <LinkPreview
                                        url={link}
                                        borderRadius="10px"
                                        backgroundColor={colors.white}
                                        borderColor={colors.blueQuartiary}
                                        imageHeight="156px"
                                        height={244}
                                        secondaryTextColor={colors.grayPrimary}
                                        fallback={
                                            <>
                                                <Skeleton.Image className="source-placeholder-image" />
                                                <Link href={link}>{link}</Link>
                                            </>
                                        }
                                        showPlaceholderIfNoImage
                                        width="100%"
                                        descriptionLength={140}
                                    />
                                    <Paragraph className="source-footer">
                                        <span>{t("claim:sourceFooter2")}</span>
                                        <a
                                            href={`mailto:${t(
                                                "common:supportEmail"
                                            )}`}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            {t("claim:sourceFooterReport")}
                                        </a>
                                    </Paragraph>
                                </Col>
                            );
                        }}
                    />
                )}
                {sources?.length > 4 && (
                    <AletheiaButton
                        type={ButtonType.blue}
                        href={`/personality/${personality.slug}/claim/${claim.slug}/sources`}
                    >
                        <Title level={4} className="all-sources-link">
                            {t("claim:seeSourcesButton")}
                        </Title>
                    </AletheiaButton>
                )}
            </Col>
        </SentenceReportContentStyle>
    );
};

export default SentenceReportContent;
