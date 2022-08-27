import { NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useDispatch } from "react-redux";
import AffixButton from "../components/AffixButton/AffixButton";

import ClaimReviewForm from "../components/ClaimReview/ClaimReviewForm";
import JsonLd from "../components/JsonLd";
import SentenceReportView from "../components/SentenceReport/SentenceReportView";
import Seo from "../components/Seo";
import { ClassificationEnum, ReviewTaskStates } from "../machine/enums";
import { ActionTypes } from "../store/types";
import { GetLocale } from "../utils/GetLocale";

const ClaimReviewPage: NextPage<{
    personality: any;
    claim: any;
    sentence: any;
    sitekey: string;
    href: string;
    claimReviewTask: any;
    claimReview: any;
    isLoggedIn: boolean;
    description: string;
}> = ({
    personality,
    claim,
    sentence,
    href,
    claimReviewTask,
    claimReview,
    isLoggedIn,
    sitekey,
    description,
}) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    dispatch({
        type: ActionTypes.SET_LOGIN_STATUS,
        login: isLoggedIn,
    });
    dispatch({
        type: ActionTypes.SET_AUTO_SAVE,
        autoSave: true,
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
            ratingValue: ClassificationEnum[review],
            bestRating: 8,
            worstRating: 1,
            alternateName: t(`claimReviewForm:${review}`),
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

            {claimReviewTask?.machine.value !== ReviewTaskStates.published ? (
                <ClaimReviewForm
                    personality={personality}
                    claim={claim}
                    sentence={sentence}
                    href={href}
                    claimReviewTask={claimReviewTask}
                    sitekey={sitekey}
                />
            ) : (
                <SentenceReportView
                    personality={personality}
                    claim={claim}
                    sentence={sentence}
                    href={href}
                    isHidden={claimReview.isHidden}
                    context={claimReview.report}
                    sitekey={sitekey}
                    hideDescription={description}
                />
            )}
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
            href: req.protocol + "://" + req.get("host") + req.originalUrl,
            isLoggedIn: req.user ? true : false,
        },
    };
}
export default ClaimReviewPage;
