import { NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useDispatch } from "react-redux";
import LoginView from "../components/Login/LoginView";
import actions from "../store/actions";

import Seo from "../components/Seo";
import { GetLocale } from "../utils/GetLocale";
import { CaptchaClientConfig } from "../types/Captcha";

const SignUpPage: NextPage<{ sitekey: string; captcha: CaptchaClientConfig }> =
    ({ sitekey, captcha }) => {
        const { t } = useTranslation();
        const dispatch = useDispatch();
        dispatch(actions.setSitekey(sitekey));
        dispatch(actions.setCaptchaConfig(captcha));

        return (
            <>
                <Seo
                    title={t("login:signup")}
                    description={t("login:signupFormHeader")}
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
            ...(await serverSideTranslations(locale)),
            sitekey: query.sitekey,
            captcha: query.captcha,
        },
    };
}

export default SignUpPage;
