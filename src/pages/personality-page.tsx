import { NextPage } from "next";
import PersonalityView from "../components/Personality/PersonalityView";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import JsonLd from "../components/JsonLd";
import { GetLocale } from "../utils/GetLocale";
import AffixButton from "../components/AffixButton/AffixButton";

const PersonalityPage: NextPage<{
    personality: any;
    href: any;
    personalities: any[];
}> = ({ personality, href, personalities }) => {
    const jsonldContent = {
        "@context": "https://schema.org",
        "@type": "Person",
        name: personality.name,
        jobTitle: personality.description,
        image: personality.image,
    };
    return (
        <>
            <JsonLd {...jsonldContent} />
            <PersonalityView
                personality={personality}
                href={href}
                personalities={personalities}
            />
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
            personalities: JSON.parse(JSON.stringify(query.personalities)),
            href: req.protocol + "://" + req.get("host") + req.originalUrl,
        },
    };
}
export default PersonalityPage;
