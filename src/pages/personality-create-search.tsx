import { NextPage } from "next";
import PersonalityCreateSearch from "../components/Personality/PersonalityCreateSearch";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetLocale } from "../utils/GetLocale";
import { NameSpaceEnum } from "../types/Namespace";
import { useSetAtom } from "jotai";
import { currentNameSpace } from "../atoms/namespace";

const PersonalityCreateSearchPage: NextPage<{ nameSpace: NameSpaceEnum }> = ({
    nameSpace,
}) => {
    const setCurrentNameSpace = useSetAtom(currentNameSpace);
    setCurrentNameSpace(nameSpace);
    return <PersonalityCreateSearch withSuggestions={true} />;
};

export async function getServerSideProps({ query, locale, locales, req }) {
    locale = GetLocale(req, locale, locales);
    query = JSON.parse(query.props);
    return {
        props: {
            ...(await serverSideTranslations(locale)),
            href: req.protocol + "://" + req.get("host") + req.originalUrl,
            nameSpace: query.nameSpace ? query.nameSpace : NameSpaceEnum.Main,
        },
    };
}
export default PersonalityCreateSearchPage;
