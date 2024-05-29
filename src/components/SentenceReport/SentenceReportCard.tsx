import { Col, Row, Typography } from "antd";
import { useTranslation } from "next-i18next";
import React from "react";
import { ContentModelEnum } from "../../types/enums";

import ClassificationText from "../ClassificationText";
import ImageClaim from "../ImageClaim";
import LocalizedDate from "../LocalizedDate";
import PersonalityMinimalCard from "../Personality/PersonalityMinimalCard";
import SentenceReportCardStyle from "./SentenceReportCard.style";
import SentenceReportSummary from "./SentenceReportSummary";
import AletheiaAlert from "../AletheiaAlert";
import { useAtom } from "jotai";
import { currentNameSpace } from "../../atoms/namespace";
import { useAppSelector } from "../../store/store";
import { generateContentPath } from "../../utils/GetContentHref";

const { Title, Paragraph } = Typography;

const SentenceReportCard = ({
    claim,
    personality,
    classification,
    content,
    hideDescription,
}: {
    personality?: any;
    claim: any;
    content: any;
    classification?: any;
    hideDescription?: string;
}) => {
    const { t } = useTranslation();
    const isImage = claim?.contentModel === ContentModelEnum.Image;
    const [nameSpace] = useAtom(currentNameSpace);
    const { vw } = useAppSelector((state) => state);

    const contentProps = {
        [ContentModelEnum.Speech]: {
            linkText: "claim:cardLinkToFullText",
            contentPath: generateContentPath(
                nameSpace,
                personality,
                claim,
                claim?.contentModel
            ),
            title: `"(...) ${content.content}"`,
            speechTypeTranslation: "claim:typeSpeech",
        },
        [ContentModelEnum.Image]: {
            linkText: "claim:cardLinkToImage",
            contentPath: generateContentPath(
                nameSpace,
                personality,
                claim,
                claim?.contentModel
            ),
            title: claim.title,
            speechTypeTranslation: "",
        },
        [ContentModelEnum.Debate]: {
            linkText: "claim:cardLinkToDebate",
            contentPath: generateContentPath(
                nameSpace,
                personality,
                claim,
                claim?.contentModel
            ),
            title: `"(...) ${content.content}"`,
            speechTypeTranslation: "claim:typeDebate",
        },
        [ContentModelEnum.Unattributed]: {
            linkText: "claim:cardLinkToFullText",
            contentPath: generateContentPath(
                nameSpace,
                personality,
                claim,
                claim?.contentModel
            ),
            title: `"(...) ${content.content}"`,
            speechTypeTranslation: "claim:typeSpeech",
        },
    };

    const { linkText, contentPath, title, speechTypeTranslation } =
        contentProps[claim?.contentModel];

    return (
        <SentenceReportCardStyle>
            <Row className="main-content">
                {personality && (
                    <Col md={6} sm={24}>
                        <PersonalityMinimalCard personality={personality} />
                    </Col>
                )}
                <Col
                    md={vw?.md && !vw?.sm ? 17 : 18}
                    offset={vw?.md && !vw?.sm ? 1 : 0}
                    sm={24}
                    className="sentence-card"
                >
                    {classification && (
                        <Title className="classification" level={1}>
                            {
                                // TODO: Create a more meaningful h1 for this page
                                t("claimReview:claimReview")
                            }
                            <ClassificationText
                                classification={classification}
                            />
                        </Title>
                    )}
                    <SentenceReportSummary
                        className={personality ? "after" : ""}
                    >
                        <Paragraph className="sentence-content">
                            <cite>{title}</cite>
                            {isImage && (
                                <ImageClaim
                                    src={content?.content}
                                    title={title}
                                />
                            )}
                            <a href={contentPath}>{t(linkText)}</a>
                        </Paragraph>
                    </SentenceReportSummary>
                    <Paragraph className="claim-info">
                        {isImage
                            ? t("claim:cardHeader3")
                            : t("claim:cardHeader1")}
                        &nbsp;
                        <LocalizedDate date={claim?.date} />
                        &nbsp;
                        {!isImage && t("claim:cardHeader2")}&nbsp;
                        <strong>{t(speechTypeTranslation)}</strong>
                    </Paragraph>
                    {hideDescription && (
                        <AletheiaAlert
                            type="warning"
                            message={t("claim:warningTitle")}
                            description={hideDescription}
                            showIcon={true}
                            style={{ padding: "10px" }}
                        />
                    )}
                </Col>
            </Row>
        </SentenceReportCardStyle>
    );
};

export default SentenceReportCard;
