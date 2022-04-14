import { NextPage } from "next";
import ClaimView from "../components/Claim/ClaimView";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { NextSeo } from 'next-seo';
import Head from "next/head";
import { useTranslation } from "next-i18next";
const parser = require('accept-language-parser');

const ClaimPage: NextPage<{ personality, claim, href }> = ({ personality, claim, href }) => {
    const { t } = useTranslation();
    
    let sentence;
    let classification;
    claim.content.object.forEach((paragraph) => {
        paragraph.content.forEach((content) => {
            if(content.props.topClassification) {
                sentence = content.content;
                classification = content.props.topClassification.classification
            }
        })
    })

    
    return (
        <>
            <Head>
                <script type="application/ld+json">{`
                {
                    "@context": "https://schema.org",
                    "@type": "ClaimReview",
                    "datePublished": "xxxx-xx-xx",
                    "url": "https://aletheiafact.org/personality/${personality.slug}/${claim.slug}",
                    "claimReviewed": "${sentence}",
                    "itemReviewed": {
                        "@type": "Claim",
                        
                    },
                    "reviewRating": {
                        "@type": "Rating",
                        "alternateName": "${classification}"
                }
                `}</script>
            </Head>

            <NextSeo
                title={claim.title}
                description={t('seo:claimDescription', { title: claim.title, name: personality.name })}
            />
            <ClaimView personality={personality} claim={claim} href={href}/>
        </>
    );
}

export async function getServerSideProps({ query, locale, locales, req }) {
    locale = parser.pick(locales, req.language) || locale || "en";
    return {
        props: {
            ...(await serverSideTranslations(locale)),
            // Nextjs have problems with client re-hydration for some serialized objects
            // This is a hack until a better solution https://github.com/vercel/next.js/issues/11993
            personality: JSON.parse(JSON.stringify(query.personality)),
            claim: JSON.parse(JSON.stringify(query.claim)),
            href: req.protocol + '://' + req.get('host') + req.originalUrl
        },
    };
}
export default ClaimPage;
