import { ActionTypes } from "../store/types";
import AffixButton from "../components/AffixButton/AffixButton";
import { GetLocale } from "../utils/GetLocale";
import { NextPage } from "next";
import React from "react";
import { ReviewTaskMachineProvider } from "../machines/reviewTask/ReviewTaskMachineProvider";
import actions from "../store/actions";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useDispatch } from "react-redux";
import { useTranslation } from "next-i18next";
import { VisualEditorProvider } from "../components/Collaborative/VisualEditorProvider";
import { NameSpaceEnum } from "../types/Namespace";
import { useSetAtom } from "jotai";
import { currentNameSpace } from "../atoms/namespace";
import { ReviewTaskTypeEnum } from "../machines/reviewTask/enums";
import ClaimReviewView from "../components/ClaimReview/ClaimReviewView";
import { ClassificationEnum } from "../types/enums";
import JsonLd from "../components/JsonLd";

export interface SourceReviewPageProps {
    source: any;
    sitekey: string;
    reviewTask: any;
    sourceReview: any;
    hideDescriptions: object;
    enableCollaborativeEditor: boolean;
    enableCopilotChatBot: boolean;
    enableEditorAnnotations: boolean;
    enableAddEditorSourcesWithoutSelecting: boolean;
    enableReviewersUpdateReport: boolean;
    enableViewReportPreview: boolean;
    websocketUrl: string;
    nameSpace: string;
}

const SourceReviewPage: NextPage<SourceReviewPageProps> = (props) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const setCurrentNameSpace = useSetAtom(currentNameSpace);
    setCurrentNameSpace(props.nameSpace as NameSpaceEnum);
    const {
        source,
        sourceReview: claimReview,
        sitekey,
        enableCollaborativeEditor,
        enableCopilotChatBot,
        enableEditorAnnotations,
        enableAddEditorSourcesWithoutSelecting,
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
            enableAddEditorSourcesWithoutSelecting,
            enableEditorAnnotations,
            enableCopilotChatBot,
            false,
            enableReviewersUpdateReport,
            enableViewReportPreview
        )
    );

    const review = source?.props?.classification;

    //TODO: Improve source review schema
    const jsonld = {
        "@context": "https://schema.org",
        "@type": "MediaReview",
        url: "https://aletheiafact.org",
        author: {
            "@type": "Organization",
            url: "https://aletheiafact.org",
            sameAs: [
                "https://www.facebook.com/AletheiaFactorg-107521791638412",
                "https://www.instagram.com/aletheiafact",
            ],
        },
        originalMediaLink: source.href,
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
            isBasedOnUrl: source.href,
        },
        datePublished: claimReview?.date,
    };

    return (
        <>
            {review && <JsonLd {...jsonld} />}

            <ReviewTaskMachineProvider
                data_hash={source.data_hash}
                baseMachine={props.reviewTask?.machine}
                baseReportModel={props?.reviewTask?.reportModel}
                publishedReview={{ review: claimReview }}
                reviewTaskType={ReviewTaskTypeEnum.Source}
            >
                <VisualEditorProvider
                    data_hash={source.data_hash}
                    source={source.href}
                >
                    <ClaimReviewView
                        content={source}
                        hideDescriptions={hideDescriptions}
                        target={source}
                    />
                </VisualEditorProvider>
            </ReviewTaskMachineProvider>
            <AffixButton />
        </>
    );
};

export async function getServerSideProps({ query, locale, locales, req }) {
    locale = GetLocale(req, locale, locales);
    query = JSON.parse(query.props);

    return {
        props: {
            ...(await serverSideTranslations(locale)),
            source: JSON.parse(JSON.stringify(query.source)),
            reviewTask: JSON.parse(JSON.stringify(query.reviewTask)),
            sourceReview: JSON.parse(JSON.stringify(query.claimReview)),
            sitekey: query.sitekey,
            hideDescriptions: JSON.parse(
                JSON.stringify(query.hideDescriptions)
            ),
            enableCollaborativeEditor: query?.enableCollaborativeEditor,
            enableCopilotChatBot: query?.enableCopilotChatBot,
            enableEditorAnnotations: query?.enableEditorAnnotations,
            enableAddEditorSourcesWithoutSelecting:
                query?.enableAddEditorSourcesWithoutSelecting,
            enableReviewersUpdateReport: query?.enableReviewersUpdateReport,
            enableViewReportPreview: query?.enableViewReportPreview,
            websocketUrl: query?.websocketUrl,
            nameSpace: query.nameSpace ? query.nameSpace : NameSpaceEnum.Main,
        },
    };
}
export default SourceReviewPage;
