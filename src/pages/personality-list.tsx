import { NextPage } from "next";
import PersonalityList from "../components/Personality/PersonalityList";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetLocale } from "../utils/GetLocale";

const PersonalityListPage: NextPage<{}> = () => {
    return (
        <PersonalityList />
    )
}

export async function getServerSideProps({ query, locale, locales, req }) {
    locale = GetLocale(req, locale, locales)
    return {
        props: {
            ...(await serverSideTranslations(locale)),
            href: req.protocol + "://" + req.get("host") + req.originalUrl,
            // Nextjs have problems with client re-hydration for some serialized objects
            // This is a hack until a better solution https://github.com/vercel/next.js/issues/11993
        },
    };
}
export default PersonalityListPage;
