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
    locale = req.cookies.default_language || parser.pick(locales, req.language) || locale || "pt";
    return {
        props: {
            ...(await serverSideTranslations(locale)),
            href: req.protocol + "://" + req.get("host") + req.originalUrl,
        },
    };
}
export default PersonalityCreateSearchPage;
