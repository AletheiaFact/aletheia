import { NextPage } from "next";
import ClaimReviewView from "../components/ClaimReview/ClaimReviewView";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import JsonLd from "../components/JsonLd";
import { useTranslation } from "next-i18next";
import { NextSeo } from "next-seo";
import SentenceReportView from "../components/ClaimReview/SentenceReportView";
import { ClassificationEnum, ReviewTaskStates } from "../machine/enums";
import { GetLocale } from "../utils/GetLocale";

const ClaimPage: NextPage<{
    personality;
    claim;
    sentence;
    sitekey;
    href;
    claimReviewTask;
    isLoggedIn;
}> = ({
    personality,
    claim,
    sentence,
    href,
    claimReviewTask,
    isLoggedIn,
    sitekey,
}) => {
    const { t } = useTranslation();
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
    };

    return (
        <>
            {review && <JsonLd {...jsonld} />}
            <NextSeo
                title={sentence.content}
                description={t("seo:claimReviewDescription", {
                    sentence: sentence.content,
                })}
            />

            {claimReviewTask?.machine.value !== ReviewTaskStates.published ? (
                <ClaimReviewView
                    personality={personality}
                    claim={claim}
                    sentence={sentence}
                    href={href}
                    claimReviewTask={claimReviewTask}
                    isLoggedIn={isLoggedIn}
                    review={review}
                    sitekey={sitekey}
                />
            ) : (
                <SentenceReportView
                    personality={personality}
                    claim={claim}
                    sentence={sentence}
                    href={href}
                    context={claimReviewTask.machine.context.reviewData}
                />
            )}
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
            sitekey: query.sitekey,
            href: req.protocol + "://" + req.get("host") + req.originalUrl,
            isLoggedIn: req.user ? true : false,
        },
    };
}
export default ClaimPage;
