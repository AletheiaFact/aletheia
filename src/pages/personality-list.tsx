import { NextPage } from "next";
import PersonalityList from "../components/Personality/PersonalityList";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetLocale } from "../utils/GetLocale";
import { useDispatch } from "react-redux";
import { ActionTypes } from "../store/types";
import AffixButton from "../components/AffixButton/AffixButton";

const PersonalityListPage: NextPage<{ isLoggedIn }> = (props) => {
    const dispatch = useDispatch();
    dispatch({
        type: ActionTypes.SET_LOGIN_STATUS,
        login: props.isLoggedIn,
    });
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
            href: req.protocol + "://" + req.get("host") + req.originalUrl,
            isLoggedIn: req.user ? true : false,
        },
    };
}
export default PersonalityListPage;
