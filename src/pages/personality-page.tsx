import { NextPage } from "next";
import PersonalityView from "../components/Personality/PersonalityView";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import JsonLd from "../components/JsonLd";
import { GetLocale } from "../utils/GetLocale";

const PersonalityPage: NextPage<{ personality: any, href: any, isLoggedIn: boolean, personalities: any[] }> = ({ personality, href, isLoggedIn, personalities }) => {
    const jsonldContent = {
        "@context": "https://schema.org",
        "@type": "Person",
        name: personality.name,
        jobTitle: personality.description,
        image: personality.image,
    }
    return (
        <>
            <JsonLd {...jsonldContent} />
            <PersonalityView personality={personality} href={href} isLoggedIn={isLoggedIn} personalities={personalities} />
        </>
    )
}

export async function getServerSideProps({ query, locale, locales, req }) {
    locale = GetLocale(req, locale, locales)
    return {
        props: {
            ...(await serverSideTranslations(locale)),
            // Nextjs have problems with client re-hydration for some serialized objects
            // This is a hack until a better solution https://github.com/vercel/next.js/issues/11993
            personality: JSON.parse(JSON.stringify(query.personality)),
            personalities: JSON.parse(JSON.stringify(query.personalities)),
            // stats: JSON.parse(JSON.stringify(query.stats)),
            href: req.protocol + '://' + req.get('host') + req.originalUrl,
            isLoggedIn: req.user ? true : false
        },
    };
}
export default PersonalityPage;
