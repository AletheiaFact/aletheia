import { NextPage } from "next";
import ClaimView from "../components/Claim/ClaimView";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { NextSeo } from 'next-seo';
import { useTranslation } from "next-i18next";
import JsonLd from "../components/JsonLd";
const parser = require('accept-language-parser');

const ClaimPage: NextPage<{ personality, claim, href }> = ({ personality, claim, href }) => {
    const { t } = useTranslation();
    const jsonld = {
        "@context": "https://schema.org",
        "@type": "Claim",
        author: {
            "@type": "Person",
            name: personality.name,
            jobTitle: personality.description,
            image: personality.image,
        },
        datePublished: claim.date,
        name: claim.title,
    }

    return (
        <>
            <NextSeo
                title={claim.title}
                description={t('seo:claimDescription', { title: claim.title, name: personality.name })}
            />
            <JsonLd {...jsonld} />
            <ClaimView personality={personality} claim={claim} href={href} />
        </>
    );
}

export async function getServerSideProps({ query, locale, locales, req }) {
    locale = req.cookies.default_language || parser.pick(locales, req.language) || locale || "pt";
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
