import {NextPage} from "next";
import PersonalityCreateSearch from "../components/Personality/PersonalityCreateSearch";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import { GetLocale } from "../utils/GetLocale";

const PersonalityCreateSearchPage: NextPage<{ withSuggestions: boolean }> = () => {
    return (
        <PersonalityCreateSearch withSuggestions={true}/>
    )
}

export async function getServerSideProps({ query, locale, locales, req }) {
    locale = GetLocale(req, locale, locales)
    return {
        props: {
            ...(await serverSideTranslations(locale)),
            href: req.protocol + "://" + req.get("host") + req.originalUrl,
        },
    };
}
export default PersonalityCreateSearchPage;
