import { NextPage } from "next";
import PersonalityList from "../components/Personality/PersonalityList";
import { GetLocale } from "../utils/GetLocale";
import AffixButton from "../components/AffixButton/AffixButton";
import { useSetAtom } from "jotai";
import { currentNameSpace } from "../atoms/namespace";
import { NameSpaceEnum } from "../types/Namespace";
import { getMessages } from "../lib/getMessages";

const PersonalityListPage: NextPage<{ nameSpace: NameSpaceEnum }> = ({
    nameSpace,
}) => {
    const setCurrentNameSpace = useSetAtom(currentNameSpace);
    setCurrentNameSpace(nameSpace);
    return (
        <>
            <PersonalityList />
            <AffixButton />
        </>
    );
};

export async function getServerSideProps({ query, locale, locales, req }) {
    locale = GetLocale(req, locale, locales);
    query = JSON.parse(query.props);
    return {
        props: {
            locale,
            messages: await getMessages(locale),
            nameSpace: query.nameSpace ? query.nameSpace : NameSpaceEnum.Main,
        },
    };
}
export default PersonalityListPage;
