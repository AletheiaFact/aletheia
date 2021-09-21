import {NextPage} from "next";
import PersonalityCreateSearch from "../components/Personality/PersonalityCreateSearch";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";

const PersonalityCreateSearchPage: NextPage<{ withSuggestions: boolean }> = () => {
    return (
        <PersonalityCreateSearch withSuggestions={true}/>
    )
}

export async function getServerSideProps({ query, locale, req }) {
    locale = locale || "en";
    return {
        props: {
            ...(await serverSideTranslations(locale))
        },
    };
}
export default PersonalityCreateSearchPage;
