import { NextPage } from "next";
import ClaimReviewView from "../components/ClaimReview/ClaimReviewView";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import JsonLd from "../components/JsonLd";
import { useTranslation } from "next-i18next";
import { NextSeo } from 'next-seo';
import { useMachine } from "@xstate/react";
import { reviewTaskMachine } from "../machine/reviewTaskMachine"
import api from '../api/ClaimReviewTaskApi'
import { ReviewTaskEvents } from "../machine/enums"
const parser = require("accept-language-parser");

const ClaimPage: NextPage<{ personality; claim; sentence; sitekey, href}> = ({
    personality,
    claim,
    sentence,
    sitekey,
    href,
}) => {
    const { t } = useTranslation();
    const review = sentence?.props?.topClassification;
    const [ state, send, service ] = useMachine(reviewTaskMachine)
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
            ratingValue: review?.classification,
            bestRating: "true",
            worstRating: "false",
            alternateName: t(`claimReviewForm:${review?.classification}`),
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
    };
    
    service.onTransition(async(state) => {
        const sentence_hash = sentence?.props["data-hash"];
        try {
            switch (state.event.type) {
                case ReviewTaskEvents.assignUser:
                    await api.createClaimReviewTask({ sentence_hash, machine: state }, t)
                    break;
                case ReviewTaskEvents.finishReport:
                    await api.updateClaimReviewTask({ sentence_hash, machine: state }, t)
                    break;
                case ReviewTaskEvents.publish:
                    await api.updateClaimReviewTask({ sentence_hash, machine: state }, t)
                    break;
            }
        } catch (e) {
            console.error("Unable to save to localStorage")
        }
    })

    return (
        <>
            {review && (
                <JsonLd {...jsonld} />
            )}
            <NextSeo
                title={sentence.content}
                description={t('seo:claimReviewDescription', { sentence: sentence.content })}
            />
            <ClaimReviewView
                personality={personality}
                claim={claim}
                sentence={sentence}
                href={href}
                state={state}
                send={send}
            />
        </>
    );
};

export async function getServerSideProps({ query, locale, locales, req }) {
    locale = parser.pick(locales, req.language) || locale || "en";
    return {
        props: {
            ...(await serverSideTranslations(locale)),
            // Nextjs have problems with client re-hydration for some serialized objects
            // This is a hack until a better solution https://github.com/vercel/next.js/issues/11993
            personality: JSON.parse(JSON.stringify(query.personality)),
            claim: JSON.parse(JSON.stringify(query.claim)),
            sentence: JSON.parse(JSON.stringify(query.sentence)),
            sitekey: query.sitekey,
            href: req.protocol + "://" + req.get("host") + req.originalUrl,
        },
    };
}
export default ClaimPage;
