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
import { CollaborativeEditorProvider } from "../components/Collaborative/CollaborativeEditorProvider";
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
    claimReviewTask: any;
    sourceReview: any;
    hideDescriptions: object;
    enableCollaborativeEditor: boolean;
    enableCopilotChatBot: boolean;
    enableEditorAnnotations: boolean;
    enableAddEditorSourcesWithoutSelecting: boolean;
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
        hideDescriptions,
    } = props;

    dispatch(actions.setWebsocketUrl(props.websocketUrl));
    dispatch(actions.setSitekey(sitekey));
    dispatch(actions.closeCopilotDrawer());
    dispatch({
        type: ActionTypes.SET_AUTO_SAVE,
        autoSave: false,
    });
    dispatch({
        type: ActionTypes.SET_COLLABORATIVE_EDIT,
        enableCollaborativeEdit: enableCollaborativeEditor,
    });
    dispatch({
        type: ActionTypes.SET_COPILOT_CHAT_BOT,
        enableCopilotChatBot: enableCopilotChatBot,
    });
    dispatch({
        type: ActionTypes.SET_EDITOR_ANNOTATION,
        enableEditorAnnotations: enableEditorAnnotations,
    });
    dispatch({
        type: ActionTypes.SET_ADD_EDITOR_SOURCES_WITHOUT_SELECTING,
        enableAddEditorSourcesWithoutSelecting:
            props.enableAddEditorSourcesWithoutSelecting,
    });

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
                baseMachine={props.claimReviewTask?.machine}
                baseReportModel={props?.claimReviewTask?.reportModel}
                publishedReview={{ review: claimReview }}
                reviewTaskType={ReviewTaskTypeEnum.Source}
            >
                <CollaborativeEditorProvider
                    data_hash={source.data_hash}
                    source={source.href}
                >
                    <ClaimReviewView
                        content={source}
                        hideDescriptions={hideDescriptions}
                        source={source}
                    />
                </CollaborativeEditorProvider>
            </ReviewTaskMachineProvider>
            <AffixButton />
        </>
    );
};

export async function getServerSideProps({ query, locale, locales, req }) {
    locale = GetLocale(req, locale, locales);
    return {
        props: {
            ...(await serverSideTranslations(locale)),
            source: JSON.parse(JSON.stringify(query.source)),
            claimReviewTask: JSON.parse(JSON.stringify(query.claimReviewTask)),
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
            websocketUrl: query?.websocketUrl,
            nameSpace: query.nameSpace ? query.nameSpace : NameSpaceEnum.Main,
        },
    };
}
export default SourceReviewPage;
