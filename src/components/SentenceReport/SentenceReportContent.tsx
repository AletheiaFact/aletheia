import { Col, Divider, Typography } from "antd";

import React, { useContext } from "react";
import SentenceReportContentStyle from "./SentenceReportContent.style";
import SourcesList from "../Source/SourcesList";
import { useTranslation } from "next-i18next";
import dompurify from "dompurify";
import ClassificationText from "../ClassificationText";
import { useSelector } from "@xstate/react";
import { publishedSelector } from "../../machines/reviewTask/selectors";
import { ReviewTaskMachineContext } from "../../machines/reviewTask/ReviewTaskMachineProvider";

const { Paragraph } = Typography;
const SentenceReportContent = ({
    context,
    classification,
    showClassification,
    href,
}) => {
    const { t } = useTranslation();
    const { machineService, publishedReview } = useContext(
        ReviewTaskMachineContext
    );
    const { summary, questions, report, verification, sources } = context;
    const sanitizer = dompurify.sanitize;
    const sortedSources = sources.sort((a, b) => a.props.sup - b.props.sup);
    const showAllSources = !(
        useSelector(machineService, publishedSelector) ||
        publishedReview?.review
    );

    return (
        <SentenceReportContentStyle>
            {showClassification && classification && (
                <Col span={24}>
                    <Paragraph className="title">
                        {t("claimReview:claimReview")}
                    </Paragraph>
                    <Paragraph className="paragraph">
                        <ClassificationText classification={classification} />
                    </Paragraph>
                    <Divider />
                </Col>
            )}
            <Col span={24}>
                <Paragraph className="title">
                    {t("claimReview:summarySectionTitle")}
                </Paragraph>
                <Paragraph className="paragraph">
                    <p
                        dangerouslySetInnerHTML={{ __html: sanitizer(summary) }}
                    />
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
                            <li
                                key={item}
                                className="paragraph"
                                dangerouslySetInnerHTML={{
                                    __html: sanitizer(item),
                                }}
                            />
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
                    <p
                        dangerouslySetInnerHTML={{ __html: sanitizer(report) }}
                        className="paragraph"
                    />
                    <Divider />
                </Col>
            )}
            {verification && (
                <Col span={24}>
                    <Paragraph className="title">
                        {t("claimReview:howSectionTitle")}
                    </Paragraph>
                    <p
                        dangerouslySetInnerHTML={{
                            __html: sanitizer(verification),
                        }}
                        className="paragraph"
                    />
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
                            sources={sortedSources}
                            seeMoreHref={`${href}/sources`}
                            showAllSources={showAllSources}
                        />
                    </>
                )}
            </Col>
        </SentenceReportContentStyle>
    );
};

export default SentenceReportContent;
