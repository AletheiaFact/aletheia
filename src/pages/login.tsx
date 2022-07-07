import { NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { NextSeo } from "next-seo";
import LoginView from "../components/Login/LoginView";
import { GetLocale } from "../utils/GetLocale";

const LoginPage: NextPage<{ data: any }> = (props) => {
    const { t } = useTranslation();
    return (
        <>
            <NextSeo title="Login" description={t("login:formHeader")} />
            <LoginView {...props} />
        </>
    );
};

export async function getServerSideProps({ locale, locales, req, query }) {
    locale = GetLocale(req, locale, locales)
    return {
        props: {
            ...(await serverSideTranslations(locale)),
            previousUrl: req.headers.referer || 'none',
            host: req.protocol + '://' + req.get('host'),
            type: query?.authType,
            href: req.protocol + "://" + req.get("host") + req.originalUrl,
        },
    };
}

export default LoginPage;
