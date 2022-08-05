import { NextPage } from "next";
import Home from "../components/Home/Home";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { NextSeo } from "next-seo";
import { useTranslation } from "next-i18next";
import { GetLocale } from "../utils/GetLocale";

const HomePage: NextPage<{ personalities; stats; href; isLoggedIn }> = (
    props
) => {
    const { t } = useTranslation();
    return (
        <>
            <NextSeo title="Home" description={t("landingPage:description")} />
            <Home {...props} />
        </>
    );
};
export async function getServerSideProps({ query, locale, locales, req }) {
    locale = GetLocale(req, locale, locales);
    return {
        props: {
            ...(await serverSideTranslations(locale)),
            // Nextjs have problems with client re-hydration for some serialized objects
            // This is a hack until a better solution https://github.com/vercel/next.js/issues/11993
            personalities: JSON.parse(JSON.stringify(query.personalities)),
            stats: JSON.parse(JSON.stringify(query.stats)),
            href: req.protocol + "://" + req.get("host") + req.originalUrl,
            isLoggedIn: req.user ? true : false,
        },
    };
}
export default HomePage;
