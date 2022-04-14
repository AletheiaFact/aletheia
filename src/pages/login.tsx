import { NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { NextSeo } from "next-seo";
import LoginView from "../components/Login/LoginView";
const parser = require("accept-language-parser");

const LoginPage: NextPage<{ data: any }> = (props) => {
    const { t } = useTranslation();
    return (
        <>
            <NextSeo title="Login" description={t("login:formHeader")} />
            <LoginView {...props} />
        </>
    );
};

export async function getServerSideProps({ locale, locales, req }) {
    locale = parser.pick(locales, req.language) || locale || "en";
    return {
        props: {
            ...(await serverSideTranslations(locale)),
            previousUrl: req.headers.referer || "none",
            host: req.protocol + "://" + req.get("host"),
        },
    };
}

export default LoginPage;
