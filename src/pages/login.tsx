import { NextPage } from "next";

import LoginView from "../components/Login/LoginView";
import Seo from "../components/Seo";
import { GetLocale } from "../utils/GetLocale";
import { useTranslations } from "next-intl";
import { getMessages } from "../lib/getMessages";

const LoginPage: NextPage<{ previousUrl: string; host: string }> = ({
    previousUrl,
    host,
}) => {
    const tLogin = useTranslations("login");
    return (
        <>
            <Seo title="Login" description={tLogin("formHeader")} />
            <LoginView shouldGoBack={previousUrl.startsWith(host)} />
        </>
    );
};

export async function getServerSideProps({ locale, locales, req }) {
    locale = GetLocale(req, locale, locales);
    return {
        props: {
            locale,
            messages: await getMessages(locale),
            href:
                req.protocol +
                "://" +
                req.get("host") +
                req.originalUrl,
            previousUrl: req.headers.referer || "none",
            host: req.protocol + "://" + req.get("host"),
        },
    };
}

export default LoginPage;
