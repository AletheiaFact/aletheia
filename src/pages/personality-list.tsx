import { NextPage } from "next";
import PersonalityList from "../components/Personality/PersonalityList";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
const parser = require('accept-language-parser');

const PersonalityListPage: NextPage<{}> = () => {
    return (
        <PersonalityList />
    )
}

export async function getServerSideProps({ query, locale, locales, req }) {
    locale = parser.pick(locales, req.language) || locale || "en";
    return {
        props: {
            ...(await serverSideTranslations(locale)),
            // Nextjs have problems with client re-hydration for some serialized objects
            // This is a hack until a better solution https://github.com/vercel/next.js/issues/11993
        },
    };
}
export default PersonalityListPage;
