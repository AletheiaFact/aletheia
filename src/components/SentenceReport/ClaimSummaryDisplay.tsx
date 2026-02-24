import React from "react";
import { ContentModelEnum } from "../../types/enums";
import SentenceReportSummary from "./SentenceReportSummary";
import { generateSentenceContentPath } from "../../utils/GetSentenceContentHref";
import ClaimInfo from "../Claim/ClaimInfo";
import { useAtom } from "jotai";
import { currentNameSpace } from "../../atoms/namespace";
import { useTranslation } from "next-i18next";
import ReviewContent from "../ClaimReview/ReviewContent";

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
            <SentenceReportSummary
                container
                className={personality ? "after" : ""}
            >
                <ReviewContent
                    title={isImage ? claim?.title : title}
                    content={content}
                    contentPath={contentPath}
                    isImage={isImage}
                    linkText={t(linkText)}
                />
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
