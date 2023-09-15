import { ClassificationEnum, ContentModelEnum } from "../types/enums";

import { ActionTypes } from "../store/types";
import AffixButton from "../components/AffixButton/AffixButton";
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

export interface ClaimReviewPageProps {
    personality?: any;
    claim: any;
    content: any;
    sitekey: string;
    claimReviewTask: any;
    claimReview: any;
    hideDescriptions: object;
    enableCollaborativeEditor: boolean;
    webSocketUrl: string;
}

const ClaimReviewPage: NextPage<ClaimReviewPageProps> = (props) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const {
        personality,
        claim,
        content,
        claimReview,
        sitekey,
        enableCollaborativeEditor,
        hideDescriptions,
    } = props;

    dispatch(actions.setWebsocketUrl(props.webSocketUrl));
    dispatch(actions.setSitekey(sitekey));
    dispatch({
        type: ActionTypes.SET_AUTO_SAVE,
        autoSave: false,
    });
    dispatch({
        type: ActionTypes.SET_COLLABORATIVE_EDIT,
        enableCollaborativeEdit: enableCollaborativeEditor,
    });

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
                baseMachine={props.claimReviewTask?.machine}
                publishedReview={{ review: claimReview }}
            >
                <ClaimReviewView
                    personality={personality}
                    claim={claim}
                    content={content}
                    hideDescriptions={hideDescriptions}
                />
            </ReviewTaskMachineProvider>
            <AffixButton personalitySlug={personality?.slug} />
        </>
    );
};

export async function getServerSideProps({ query, locale, locales, req }) {
    locale = GetLocale(req, locale, locales);
    return {
        props: {
            ...(await serverSideTranslations(locale)),
            // Nextjs have problems with client re-hydration for some serialized objects
            // This is a hack until a better solution https://github.com/vercel/next.js/issues/11993
            personality: JSON.parse(JSON.stringify(query.personality)),
            claim: JSON.parse(JSON.stringify(query.claim)),
            content: JSON.parse(JSON.stringify(query.content)),
            claimReviewTask: JSON.parse(JSON.stringify(query.claimReviewTask)),
            claimReview: JSON.parse(JSON.stringify(query.claimReview)),
            sitekey: query.sitekey,
            hideDescriptions: JSON.parse(
                JSON.stringify(query.hideDescriptions)
            ),
            enableCollaborativeEditor: query?.enableCollaborativeEditor,
            websocketUrl: query?.websocketUrl,
        },
    };
}
export default ClaimReviewPage;
