import { NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import LoginView from "../components/Login/LoginView";

import Seo from "../components/Seo";
import { GetLocale } from "../utils/GetLocale";

const SignUpPage: NextPage = () => {
    const { t } = useTranslation();
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

export async function getServerSideProps({ locale, locales, req }) {
    locale = GetLocale(req, locale, locales);
    return {
        props: {
            ...(await serverSideTranslations(locale)),
        },
    };
}

export default SignUpPage;
