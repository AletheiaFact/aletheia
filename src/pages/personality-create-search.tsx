import {NextPage} from "next";
import PersonalityCreateSearch from "../components/Personality/PersonalityCreateSearch";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
const parser = require('accept-language-parser');

const PersonalityCreateSearchPage: NextPage<{ withSuggestions: boolean }> = () => {
    return (
        <PersonalityCreateSearch withSuggestions={true}/>
    )
}

export async function getServerSideProps({ query, locale, locales, req }) {
    locale = parser.pick(locales, req.language) || locale || "en";
    return {
        props: {
            ...(await serverSideTranslations(locale))
        },
    };
}
export default PersonalityCreateSearchPage;
