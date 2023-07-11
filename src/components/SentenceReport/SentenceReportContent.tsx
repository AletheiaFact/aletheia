import { Col, Divider, Typography } from "antd";

import React from "react";
import SentenceReportContentStyle from "./SentenceReportContent.style";
import SourcesList from "../Source/SourcesList";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

const { Paragraph } = Typography;
const SentenceReportContent = ({ context }) => {
    const { t } = useTranslation();
    const { summary, questions, report, verification, sources } = context;
    const router = useRouter();

    return (
        <SentenceReportContentStyle>
            <Col span={24}>
                <Paragraph className="title">
                    {t("claimReview:summarySectionTitle")}
                </Paragraph>
                <Paragraph className="paragraph">
                    <p dangerouslySetInnerHTML={{ __html: summary }} />
                </Paragraph>
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
                {sources && (
                    <>
                        <Typography.Title level={4}>
                            {t("claim:sourceSectionTitle")}
                        </Typography.Title>
                        <SourcesList
                            sources={sources}
                            seeMoreHref={`${router.asPath}/sources`}
                        />
                    </>
                )}
            </Col>
        </SentenceReportContentStyle>
    );
};

export default SentenceReportContent;
