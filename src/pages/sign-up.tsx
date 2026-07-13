import { NextPage } from "next";
import { useDispatch } from "react-redux";
import LoginView from "../components/Login/LoginView";
import actions from "../store/actions";

import Seo from "../components/Seo";
import { GetLocale } from "../utils/GetLocale";
import { useTranslations } from "next-intl";
import { getMessages } from "../lib/getMessages";

const SignUpPage: NextPage<{ sitekey: string }> = ({ sitekey }) => {
    const tLogin = useTranslations("login");
    const dispatch = useDispatch();
    dispatch(actions.setSitekey(sitekey));

    return (
        <>
            <Seo
                title={tLogin("signup")}
                description={tLogin("signupFormHeader")}
            />
            <LoginView isSignUp />
        </>
    );
};

export async function getServerSideProps({ locale, locales, req, query }) {
    locale = GetLocale(req, locale, locales);
    query = JSON.parse(query.props);

    return {
        props: {
            locale,
            messages: await getMessages(locale),
            sitekey: query.sitekey,
        },
    };
}

export default SignUpPage;
