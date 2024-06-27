import React from "react";
import { ContentModelEnum } from "../../types/enums";
import SentenceReportSummary from "./SentenceReportSummary";
import { generateSentenceContentPath } from "../../utils/GetSentenceContentHref";
import { Typography } from "antd";
import ImageClaim from "../ImageClaim";
import ClaimInfo from "../Claim/ClaimInfo";
import { useAtom } from "jotai";
import { currentNameSpace } from "../../atoms/namespace";
import { useTranslation } from "next-i18next";

const { Paragraph } = Typography;

const ClaimSummaryDisplay = ({
    claim,
    personality,
    content,
}: {
    personality?: any;
    claim: any;
    content: any;
}) => {
    const { t } = useTranslation();
    const isImage = claim?.contentModel === ContentModelEnum.Image;
    const [nameSpace] = useAtom(currentNameSpace);

    const contentProps = {
        [ContentModelEnum.Speech]: {
            linkText: "claim:cardLinkToFullText",
            contentPath: generateSentenceContentPath(
                nameSpace,
                personality,
                claim,
                claim?.contentModel
            ),
            title: `"(...) ${content}"`,
            speechTypeTranslation: "claim:typeSpeech",
        },
        [ContentModelEnum.Image]: {
            linkText: "claim:cardLinkToImage",
            contentPath: generateSentenceContentPath(
                nameSpace,
                personality,
                claim,
                claim?.contentModel
            ),
            title: claim?.title,
            speechTypeTranslation: "",
        },
        [ContentModelEnum.Debate]: {
            linkText: "claim:cardLinkToDebate",
            contentPath: generateSentenceContentPath(
                nameSpace,
                personality,
                claim,
                claim?.contentModel
            ),
            title: `"(...) ${content}"`,
            speechTypeTranslation: "claim:typeDebate",
        },
        [ContentModelEnum.Unattributed]: {
            linkText: "claim:cardLinkToFullText",
            contentPath: generateSentenceContentPath(
                nameSpace,
                personality,
                claim,
                claim?.contentModel
            ),
            title: `"(...) ${content}"`,
            speechTypeTranslation: "claim:typeSpeech",
        },
    };

    const { linkText, contentPath, title, speechTypeTranslation } =
        contentProps[claim?.contentModel];

    return (
        <>
            <SentenceReportSummary className={personality ? "after" : ""}>
                <Paragraph className="sentence-content">
                    <cite>{title}</cite>
                    {isImage && (
                        <ImageClaim
                            src={content?.content}
                            title={claim?.title}
                        />
                    )}
                    <a href={contentPath}>{t(linkText)}</a>
                </Paragraph>
            </SentenceReportSummary>
            <ClaimInfo
                date={claim.date}
                isImage={isImage}
                speechTypeTranslation={speechTypeTranslation}
            />
        </>
    );
};

export default ClaimSummaryDisplay;
