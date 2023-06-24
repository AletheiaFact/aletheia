import { NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import LoginView from "../components/Login/LoginView";
import Seo from "../components/Seo";
import { GetLocale } from "../utils/GetLocale";

const LoginPage: NextPage<{ previousUrl: string; host: string }> = ({
    previousUrl,
    host,
}) => {
    const { t } = useTranslation();
    return (
        <>
            <Seo title="Login" description={t("login:formHeader")} />
            <LoginView shouldGoBack={previousUrl.startsWith(host)} />
        </>
    );
};

export async function getServerSideProps({ locale, locales, req, query }) {
    locale = GetLocale(req, locale, locales);
    return {
        props: {
            ...(await serverSideTranslations(locale)),
            previousUrl: req.headers.referer || "none",
            host: req.protocol + "://" + req.get("host"),
            href: req.protocol + "://" + req.get("host") + req.originalUrl,
        },
    };
}

export default LoginPage;
