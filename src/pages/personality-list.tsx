import { NextPage } from "next";
import PersonalityList from "../components/Personality/PersonalityList";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetLocale } from "../utils/GetLocale";
import AffixButton from "../components/AffixButton/AffixButton";

const PersonalityListPage: NextPage = () => {
    return (
        <>
            <PersonalityList />
            <AffixButton />
        </>
    );
};

export async function getServerSideProps({ locale, locales, req }) {
    locale = GetLocale(req, locale, locales);
    return {
        props: {
            ...(await serverSideTranslations(locale)),
        },
    };
}
export default PersonalityListPage;
