import { NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React from "react";
import { useDispatch } from "react-redux";

import AffixButton from "../components/AffixButton/AffixButton";
import ClaimReviewView from "../components/ClaimReview/ClaimReviewView";
import JsonLd from "../components/JsonLd";
import Seo from "../components/Seo";
import { ReviewTaskMachineProvider } from "../machines/reviewTask/ReviewTaskMachineProvider";
import { ClassificationEnum } from "../types/enums";
import actions from "../store/actions";
import { ActionTypes } from "../store/types";
import { GetLocale } from "../utils/GetLocale";

export interface ClaimReviewPageProps {
    personality: any;
    claim: any;
    sentence: any;
    sitekey: string;
    claimReviewTask: any;
    claimReview: any;
    isLoggedIn: boolean;
    description: string;
    userRole: string;
    userId?: string;
}

const ClaimReviewPage: NextPage<ClaimReviewPageProps> = (props) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const {
        personality,
        claim,
        sentence,
        claimReview,
        isLoggedIn,
        userRole,
        userId,
        sitekey,
    } = props;

    dispatch(actions.setLoginStatus(isLoggedIn));
    dispatch(actions.setUserId(userId));
    dispatch(actions.setUserRole(userRole));
    dispatch(actions.setSitekey(sitekey));
    dispatch({
        type: ActionTypes.SET_AUTO_SAVE,
        autoSave: false,
    });

    const review = sentence?.props?.classification;

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
        claimReviewed: sentence.content,
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
                name: personality.name,
                jobTitle: personality.description,
                image: personality.image,
            },
            datePublished: claim.date,
            name: claim.title,
        },
        datePublished: sentence.date,
    };

    return (
        <>
            {review && <JsonLd {...jsonld} />}
            <Seo
                title={sentence.content}
                description={t("seo:claimReviewDescription", {
                    sentence: sentence.content,
                })}
            />

            <ReviewTaskMachineProvider
                data_hash={sentence.data_hash}
                baseMachine={props.claimReviewTask?.machine}
                publishedReview={{
                    review: claimReview,
                    descriptionForHide: props.description,
                }}
            >
                <ClaimReviewView
                    personality={personality}
                    claim={claim}
                    content={sentence}
                />
            </ReviewTaskMachineProvider>
            <AffixButton personalitySlug={personality.slug} />
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
            sentence: JSON.parse(JSON.stringify(query.sentence)),
            claimReviewTask: JSON.parse(JSON.stringify(query.claimReviewTask)),
            claimReview: JSON.parse(JSON.stringify(query.claimReview)),
            sitekey: query.sitekey,
            description: query.description,
            isLoggedIn: req.user ? true : false,
            userRole: req?.user?.role ? req?.user?.role : null,
            userId: req?.user?._id || "",
        },
    };
}
export default ClaimReviewPage;
