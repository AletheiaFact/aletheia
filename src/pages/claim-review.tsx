import { ClassificationEnum, ContentModelEnum } from "../types/enums";

import AffixCopilotButton from "../components/AffixButton/AffixCopilotButton";
import ClaimReviewView from "../components/ClaimReview/ClaimReviewView";
import { GetLocale } from "../utils/GetLocale";
import JsonLd from "../components/JsonLd";
import { NextPage } from "next";
import React from "react";
import { ReviewTaskMachineProvider } from "../machines/reviewTask/ReviewTaskMachineProvider";
import Seo from "../components/Seo";
import actions from "../store/actions";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useDispatch } from "react-redux";
import { useTranslation } from "next-i18next";
import { VisualEditorProvider } from "../components/Collaborative/VisualEditorProvider";
import { NameSpaceEnum } from "../types/Namespace";
import { useSetAtom } from "jotai";
import { currentNameSpace } from "../atoms/namespace";
import { ReviewTaskTypeEnum } from "../machines/reviewTask/enums";

export interface ClaimReviewPageProps {
    personality?: any;
    claim: any;
    content: any;
    sitekey: string;
    reviewTask: any;
    claimReview: any;
    hideDescriptions: object;
    enableCollaborativeEditor: boolean;
    enableCopilotChatBot: boolean;
    enableEditorAnnotations: boolean;
    enableReviewersUpdateReport: boolean;
    enableViewReportPreview: boolean;
    websocketUrl: string;
    nameSpace: string;
}

const ClaimReviewPage: NextPage<ClaimReviewPageProps> = (props) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const setCurrentNameSpace = useSetAtom(currentNameSpace);
    setCurrentNameSpace(props.nameSpace as NameSpaceEnum);
    const {
        personality,
        claim,
        content,
        claimReview,
        sitekey,
        enableCollaborativeEditor,
        enableCopilotChatBot,
        enableEditorAnnotations,
        enableReviewersUpdateReport,
        enableViewReportPreview,
        hideDescriptions,
    } = props;

    dispatch(actions.setWebsocketUrl(props.websocketUrl));
    dispatch(actions.setSitekey(sitekey));
    dispatch(actions.closeCopilotDrawer());
    dispatch(
        actions.setEditorEnvironment(
            enableCollaborativeEditor,
            enableEditorAnnotations,
            enableCopilotChatBot,
            false,
            enableReviewersUpdateReport,
            enableViewReportPreview
        )
    );

    const isImage = claim?.contentModel === ContentModelEnum.Image;
    const review = content?.props?.classification;

    const jsonld = {
        "@context": "https://schema.org",
        "@type": "ClaimReview",
        url: "https://aletheiafact.org",
        author: {
            "@type": "Organization",
            url: "https://aletheiafact.org",
            sameAs: [
                "https://www.facebook.com/AletheiaFactorg-107521791638412",
                "https://www.instagram.com/aletheiafact",
            ],
        },
        claimReviewed: content.content,
        reviewRating: {
            "@type": "Rating",
            ratingValue: claimReview?.isHidden ? 0 : ClassificationEnum[review],
            bestRating: 8,
            worstRating: 1,
            alternateName: claimReview?.isHidden
                ? t("claimReviewForm:notReviewed")
                : t(`claimReviewForm:${review}`),
        },
        itemReviewed: {
            "@type": "CreativeWork",
            author: {
                "@type": "Person",
                name: personality?.name,
                jobTitle: personality?.description,
                image: personality?.image,
            },
            datePublished: claim.date,
            name: claim.title,
        },
        datePublished: content.date,
    };

    return (
        <>
            {review && <JsonLd {...jsonld} />}
            <Seo
                title={isImage ? claim.title : content.content}
                description={t("seo:claimReviewDescription", {
                    sentence: content.content,
                })}
            />

            <ReviewTaskMachineProvider
                data_hash={content.data_hash}
                baseMachine={props.reviewTask?.machine}
                baseReportModel={props?.reviewTask?.reportModel}
                publishedReview={{ review: claimReview }}
                reviewTaskType={ReviewTaskTypeEnum.Claim}
                claim={claim}
                sentenceContent={content.content}
            >
                <VisualEditorProvider data_hash={content.data_hash}>
                    <ClaimReviewView
                        personality={personality}
                        target={claim}
                        content={content}
                        hideDescriptions={hideDescriptions}
                    />
                </VisualEditorProvider>
            </ReviewTaskMachineProvider>
            {enableCopilotChatBot && <AffixCopilotButton />}
        </>
    );
};

export async function getServerSideProps({ query, locale, locales, req }) {
    locale = GetLocale(req, locale, locales);
    query = JSON.parse(query.props);
    return {
        props: {
            ...(await serverSideTranslations(locale)),
            // Nextjs have problems with client re-hydration for some serialized objects
            // This is a hack until a better solution https://github.com/vercel/next.js/issues/11993
            personality: JSON.parse(JSON.stringify(query.personality)),
            claim: JSON.parse(JSON.stringify(query.claim)),
            content: JSON.parse(JSON.stringify(query.content)),
            reviewTask: JSON.parse(JSON.stringify(query.reviewTask)),
            claimReview: JSON.parse(JSON.stringify(query.claimReview)),
            sitekey: query.sitekey,
            hideDescriptions: JSON.parse(
                JSON.stringify(query.hideDescriptions)
            ),
            enableCollaborativeEditor: query?.enableCollaborativeEditor,
            enableCopilotChatBot: query?.enableCopilotChatBot,
            enableEditorAnnotations: query?.enableEditorAnnotations,
            enableReviewersUpdateReport: query?.enableReviewersUpdateReport,
            enableViewReportPreview: query?.enableViewReportPreview,
            websocketUrl: query?.websocketUrl,
            nameSpace: query.nameSpace ? query.nameSpace : NameSpaceEnum.Main,
        },
    };
}
export default ClaimReviewPage;
